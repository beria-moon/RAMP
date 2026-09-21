"use strict";

const methods = [
  "RAMP (Ours)",
  "ACE-Step-Base",
  "VIBE",
  "CMA-OT",
  "Text-Inv",
  "LORIS",
  "CDCD",
  "D2M-GAN",
  "MotionComposer",
];

const cases = [
  {
    sample: "S02",
    source: "608c90d57857459f877f3f2bf81c19ee",
    scores: [5.00, 5.00, 4.67, 5.00],
    assets: ["M09", "M03", "M06", "M01", "M05", "M02", "M08", "M07", "M04"],
  },
  {
    sample: "S10",
    source: "1c2921c55c5d4b49aa230accb2f2bb01",
    scores: [4.67, 4.67, 4.33, 4.67],
    assets: ["M04", "M03", "M06", "M07", "M02", "M08", "M01", "M05", "M09"],
  },
  {
    sample: "S04",
    source: "903a8e5c2d4643d1a89c1ebdbeceb3f2",
    scores: [4.33, 4.33, 4.00, 4.00],
    assets: ["M06", "M07", "M09", "M05", "M02", "M03", "M01", "M04", "M08"],
  },
  {
    sample: "S08",
    source: "2b39b58174114fabad252384c9ee3b2a",
    scores: [4.33, 4.33, 4.00, 4.00],
    assets: ["M05", "M02", "M06", "M03", "M04", "M09", "M01", "M08", "M07"],
  },
  {
    sample: "S05",
    source: "73cbaec9f8a643d5965a0c53dadaefc8",
    scores: [4.00, 4.00, 4.33, 4.00],
    assets: ["M05", "M04", "M06", "M08", "M03", "M07", "M09", "M01", "M02"],
  },
];

function buildVideoCard(item, method, asset) {
  const card = document.createElement("article");
  card.className = `video-card ${method.startsWith("RAMP") ? "ours" : ""}`;
  const heading = document.createElement("div");
  heading.className = "video-heading";
  const name = document.createElement("h4");
  name.textContent = method;
  heading.append(name);
  if (method.startsWith("RAMP")) {
    const badge = document.createElement("span");
    badge.textContent = "Ours";
    heading.append(badge);
  }
  const video = document.createElement("video");
  video.controls = true;
  video.playsInline = true;
  const version = method === "CDCD" || method === "D2M-GAN" ? "?v=5s-loop" : "";
  prepareVideo(video, `assets/${item.sample}/${asset}.mp4${version}`);
  video.setAttribute("aria-label", `${method}, ${item.sample}`);
  card.append(heading, video);
  return card;
}

function renderCases() {
  const container = document.getElementById("demoCases");
  container.replaceChildren();
  const orderedCases = [...cases].sort((left, right) =>
    left.sample.localeCompare(right.sample, undefined, { numeric: true })
  );
  orderedCases.forEach((item, index) => {
    const section = document.createElement("article");
    section.className = "demo-case";
    const title = document.createElement("h3");
    title.className = "case-title";
    title.textContent = `Case ${index + 1}`;
    const grid = document.createElement("div");
    grid.className = "video-grid";
    methods.forEach((method, methodIndex) => {
      grid.append(buildVideoCard(item, method, item.assets[methodIndex]));
    });
    section.append(title, grid);
    container.append(section);
  });
}

renderCases();
