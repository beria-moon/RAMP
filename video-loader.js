"use strict";

const videoObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadVideoSource(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "600px 0px" }
    )
  : null;

function loadVideoSource(video) {
  if (video.src || !video.dataset.src) return;
  video.src = video.dataset.src;
  video.preload = "metadata";
  video.load();
}

function prepareVideo(video, source) {
  video.preload = "none";
  video.dataset.src = source;
  video.addEventListener("pointerdown", () => loadVideoSource(video), { once: true });
  video.addEventListener("focus", () => loadVideoSource(video), { once: true });

  if (videoObserver) {
    videoObserver.observe(video);
  } else {
    loadVideoSource(video);
  }
}

document.addEventListener(
  "play",
  (event) => {
    if (!(event.target instanceof HTMLVideoElement)) return;
    document.querySelectorAll("video").forEach((video) => {
      if (video !== event.target) video.pause();
    });
  },
  true
);
