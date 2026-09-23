"use strict";

const decouplingCases = [
  {
    id: "0e32943e1e774288b015705eca096f7a",
    title: "Eurodance to Funk",
    original:
      "Upbeat danceable late-90s and early-2000s Eurodance club pop instrumental with bright synthesizers and electronic bass.",
    modified:
      "A polished funk instrumental led by clean electric guitar, slap bass, brass stabs, and bright keys, with a playful and celebratory mood.",
    modifiedStyle: "Funk",
    version: "instrumental",
  },
  {
    id: "1e64a475a2be42d39ba7c9055bdd44cf",
    title: "Pop Dance to Rock",
    original:
      "Energetic pop dance with driving beats, catchy synths, and upbeat female vocals.",
    modified:
      "Energetic rock with distorted guitars, punchy drums, electric bass, and powerful female vocals.",
    modifiedStyle: "Rock",
    version: "lyrics-preserved",
  },
  {
    id: "1f0d370221254952b220f370ba708b58",
    title: "K-pop/R&B to Cinematic Orchestral",
    original:
      "A vibrant and energetic K-pop track featuring catchy, bright female vocals singing over a bouncy, rhythmic beat with R&B influences, creating a lively and engaging atmosphere.",
    modified:
      "A cinematic orchestral pop arrangement led by sweeping strings, bold brass, and powerful percussion, featuring expressive female vocals with a dramatic and uplifting mood.",
    modifiedStyle: "Cinematic Orchestral",
    version: "lyrics-preserved",
  },
  {
    id: "b5bb2f3746694bd9b9af514e8333c767",
    title: "Mandopop to Funk",
    original:
      "A dreamy Mandopop song featuring a soft female vocal, a smooth electronic beat, and atmospheric synth textures that create an intimate and romantic vibe.",
    modified:
      "A dreamy Funk song featuring a soft female vocal, a smooth bass-and-drum groove, and atmospheric guitar and keyboard textures creating an intimate, romantic vibe.",
    modifiedStyle: "Funk",
    version: "selected-50",
  },
  {
    id: "ecb872577c7c4cb8ae3271a57da44e5d",
    title: "Electronic Hip-hop to Funk",
    original:
      "A high-energy electronic hip-hop track featuring a driving, rhythmic beat and a catchy vocal sample that encourages movement.",
    modified:
      "A high-energy Funk track featuring a driving rhythmic beat, propulsive bass guitar, and a catchy vocal sample that encourages movement.",
    modifiedStyle: "Funk",
    version: "selected-50",
  },
];

function buildDecouplingVideo(item, variant) {
  const modified = variant === "modified";
  const card = document.createElement("article");
  card.className = `decoupling-video-card ${modified ? "modified" : "original"}`;

  const label = document.createElement("h4");
  label.textContent = modified
    ? `Modified Prompt · ${item.modifiedStyle}`
    : "Original Prompt";

  const video = document.createElement("video");
  video.controls = true;
  video.playsInline = true;
  prepareVideo(
    video,
    `assets/decoupling/${item.id}/${variant}.mp4?v=${item.version}`
  );
  video.setAttribute("aria-label", `${item.title}, ${label.textContent}`);

  const prompt = document.createElement("p");
  prompt.className = "decoupling-prompt";
  prompt.textContent = modified ? item.modified : item.original;

  card.append(label, video, prompt);
  return card;
}

function renderDecouplingCases() {
  const container = document.getElementById("decouplingCases");
  container.replaceChildren();
  decouplingCases.forEach((item, index) => {
    const section = document.createElement("article");
    section.className = "decoupling-case";

    const title = document.createElement("h3");
    title.textContent = `Case ${index + 1} · ${item.title}`;

    const grid = document.createElement("div");
    grid.className = "decoupling-grid";
    grid.append(
      buildDecouplingVideo(item, "original"),
      buildDecouplingVideo(item, "modified")
    );
    section.append(title, grid);
    container.append(section);
  });
}

renderDecouplingCases();
