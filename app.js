"use strict";

const labels = "ABCDEFGHI".split("");
const storageKey = "danceMusicSurveyGithubV1";
const $ = (id) => document.getElementById(id);
let state = loadState();
let currentSample = 0;
let currentCandidate = 0;

function shuffled(items) {
  const output = [...items];
  for (let i = output.length - 1; i > 0; i -= 1) {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const j = random[0] % (i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  const mapping = Object.fromEntries(samples.map((sample) => [sample, shuffled(methods)]));
  return {
    participant: `P-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    mapping,
    ratings: {},
  };
}

function saveState() {
  state.participant = $("participant").value.trim();
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateProgress();
}

function key(sampleIndex = currentSample, candidateIndex = currentCandidate) {
  return `${samples[sampleIndex]}::${labels[candidateIndex]}`;
}

function rating() {
  return state.ratings[key()] || { watched: false, scores: {} };
}

function isComplete(item) {
  return item.watched && dimensions.every(([id]) => item.scores[id]);
}

function buildDimensions() {
  const container = $("dimensions");
  container.textContent = "";
  dimensions.forEach(([id, title, description]) => {
    const node = $("dimensionTemplate").content.cloneNode(true);
    node.querySelector("legend").textContent = title;
    node.querySelector(".description").textContent = description;
    const scale = node.querySelector(".scale");
    for (let score = 1; score <= 5; score += 1) {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="${id}" value="${score}"><span>${score}</span>`;
      label.querySelector("input").addEventListener("change", () => {
        const item = rating();
        item.scores[id] = score;
        state.ratings[key()] = item;
        saveState();
        renderStatus();
      });
      scale.append(label);
    }
    container.append(node);
  });
}

function render() {
  const sample = samples[currentSample];
  const method = state.mapping[sample][currentCandidate];
  const item = rating();
  $("sampleTitle").textContent = `舞蹈样本 ${String(currentSample + 1).padStart(2, "0")}`;
  $("candidateTitle").textContent = `候选 ${labels[currentCandidate]}`;
  $("video").src = `assets/${sample}/${method}.mp4`;
  $("watched").checked = item.watched;
  dimensions.forEach(([id]) => {
    const selected = document.querySelector(`input[name="${id}"][value="${item.scores[id]}"]`);
    if (selected) selected.checked = true;
  });
  renderNavigation();
  renderStatus();
}

function renderNavigation() {
  $("sampleNav").textContent = "";
  samples.forEach((sample, index) => {
    const button = document.createElement("button");
    const done = labels.every((label) => isComplete(state.ratings[`${sample}::${label}`] || {}));
    button.textContent = String(index + 1).padStart(2, "0");
    button.className = `${index === currentSample ? "active" : ""} ${done ? "done" : ""}`;
    button.addEventListener("click", () => switchTo(index, 0));
    $("sampleNav").append(button);
  });
  $("candidateNav").textContent = "";
  labels.forEach((label, index) => {
    const button = document.createElement("button");
    const done = isComplete(state.ratings[key(currentSample, index)] || {});
    button.innerHTML = `<span>候选 ${label}</span><span>${done ? "✓" : "○"}</span>`;
    button.className = `${index === currentCandidate ? "active" : ""} ${done ? "done" : ""}`;
    button.addEventListener("click", () => switchTo(currentSample, index));
    $("candidateNav").append(button);
  });
}

function renderStatus() {
  const done = isComplete(rating());
  $("candidateStatus").textContent = done ? "已完成" : "待评分";
  $("candidateStatus").className = `status ${done ? "done" : ""}`;
  $("next").disabled = !done;
  $("previous").disabled = currentSample === 0 && currentCandidate === 0;
  renderNavigation();
}

function switchTo(sampleIndex, candidateIndex) {
  currentSample = sampleIndex;
  currentCandidate = candidateIndex;
  document.querySelectorAll(".scale input").forEach((input) => { input.checked = false; });
  $("video").pause();
  render();
  window.scrollTo({ top: $("sampleNav").offsetTop - 12, behavior: "smooth" });
}

function updateProgress() {
  const completed = Object.values(state.ratings).filter(isComplete).length;
  $("progressText").textContent = `已完成 ${completed} / 90`;
  $("progressBar").style.width = `${completed / 90 * 100}%`;
  $("finishText").textContent = completed === 90 ? "全部评分已完成，可以导出结果。" : `还需完成 ${90 - completed} 组评分。`;
  $("download").disabled = completed !== 90;
}

function move(delta) {
  const flat = currentSample * 9 + currentCandidate + delta;
  if (flat < 0 || flat >= 90) return;
  switchTo(Math.floor(flat / 9), flat % 9);
}

function downloadCsv() {
  const rows = [["participant", "sample_index", "sample_id", "candidate", "asset_id",
    ...dimensions.map(([, title]) => title)]];
  samples.forEach((sample, sampleIndex) => labels.forEach((label, candidateIndex) => {
    const item = state.ratings[`${sample}::${label}`];
    rows.push([state.participant, sampleIndex + 1, sample, label,
      state.mapping[sample][candidateIndex], ...dimensions.map(([id]) => item.scores[id])]);
  }));
  const quote = (value) => `"${String(value).replaceAll("\"", "\"\"")}"`;
  const blob = new Blob(["\uFEFF", rows.map((row) => row.map(quote).join(",")).join("\n")],
    { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${state.participant || "participant"}_dance_music_ratings.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

buildDimensions();
$("participant").value = state.participant;
$("participant").addEventListener("change", saveState);
$("watched").addEventListener("change", () => {
  const item = rating();
  item.watched = $("watched").checked;
  state.ratings[key()] = item;
  saveState();
  renderStatus();
});
$("video").addEventListener("ended", () => {
  if (!$("watched").checked) $("watched").click();
});
$("next").addEventListener("click", () => move(1));
$("previous").addEventListener("click", () => move(-1));
$("download").addEventListener("click", downloadCsv);
$("reset").addEventListener("click", () => {
  if (confirm("确定清除当前浏览器中的全部评分吗？")) {
    localStorage.removeItem(storageKey);
    location.reload();
  }
});
render();
updateProgress();
