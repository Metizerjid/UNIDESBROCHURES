// Each folder contains exactly three poster options. On every page load the
// viewer selects one poster from each folder, then shuffles the four results.
// Folder names are internal and are never shown to visitors.
const posterFolders = [
  {
    path: "assets/posters/klasor-1",
    posters: [
      { id: "1-1", title: "Poster 1", file: "d0f05b1970e49ce7cfe0425b0e535a21.jpg" },
      { id: "1-2", title: "Poster 2", file: "d941b415ba4e1054181518ecb7550c1c.jpg" },
      { id: "1-3", title: "Poster 3", file: "e0160e6c4e0544c87c418757926ec3ea.jpg" },
    ],
  },
  {
    path: "assets/posters/klasor-2",
    posters: [
      { id: "2-1", title: "Poster 4", file: "3ec757fdda954a5efba6c581cbcc3304.jpg" },
      { id: "2-2", title: "Poster 5", file: "4bcff2730fe14ab46cbd8e4626d1df17.jpg" },
      { id: "2-3", title: "Poster 6", file: "83ee210445be3d25451aa18bfba6451c.jpg" },
    ],
  },
  {
    path: "assets/posters/klasor-3",
    posters: [
      { id: "3-1", title: "The Design Lab", file: "poster-1.svg" },
      { id: "3-2", title: "Living Systems", file: "poster-2.svg" },
      { id: "3-3", title: "Voices in History", file: "poster-3.svg" },
    ],
  },
  {
    path: "assets/posters/klasor-4",
    posters: [
      { id: "4-1", title: "Future Makers", file: "poster-1.svg" },
      { id: "4-2", title: "Earth & Energy", file: "poster-2.svg" },
      { id: "4-3", title: "Ideas into Action", file: "poster-3.svg" },
    ],
  },
];

const elements = {
  stage: document.querySelector("#poster-stage"),
  frame: document.querySelector(".poster-frame"),
  image: document.querySelector("#poster-image"),
  title: document.querySelector("#poster-title"),
  counter: document.querySelector("#poster-counter"),
  dots: document.querySelector("#poster-dots"),
  loading: document.querySelector("#loading-state"),
  previous: document.querySelector(".previous"),
  next: document.querySelector(".next"),
};

const state = {
  posters: [],
  index: 0,
  dragStartX: null,
  pointerId: null,
};

function randomIndex(max) {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalizePoster(item, index) {
  const image = item?.image || item?.imageUrl || item?.url || item?.src;
  if (!image) return null;

  return {
    id: String(item.id ?? index + 1),
    title: item.title || item.name || `Poster ${index + 1}`,
    image,
  };
}

function loadPosters() {
  return posterFolders
    .map((folder, folderIndex) => {
      if (!folder.posters.length) return null;
      const selected = folder.posters[randomIndex(folder.posters.length)];
      return normalizePoster(
        {
          ...selected,
          image: `${folder.path}/${selected.file}`,
        },
        folderIndex,
      );
    })
    .filter(Boolean);
}

function buildDots() {
  elements.dots.replaceChildren(
    ...state.posters.map((poster, index) => {
      const dot = document.createElement("button");
      dot.className = "poster-dot";
      dot.type = "button";
      dot.textContent = `Show ${poster.title}`;
      dot.setAttribute("aria-current", String(index === state.index));
      dot.addEventListener("click", () => goToPoster(index));
      return dot;
    }),
  );
}

function finishImageLoad() {
  elements.image.classList.remove("is-loading");
  elements.loading.hidden = true;
}

function preloadNeighborPosters() {
  if (state.posters.length < 2) return;
  const previousIndex = (state.index - 1 + state.posters.length) % state.posters.length;
  const nextIndex = (state.index + 1) % state.posters.length;
  [previousIndex, nextIndex].forEach((index) => {
    const preload = new Image();
    preload.src = state.posters[index].image;
  });
}

function renderPoster(direction = "") {
  const poster = state.posters[state.index];
  if (!poster) return;

  elements.frame.className = `poster-frame${direction ? ` is-${direction}` : ""}`;
  elements.image.classList.add("is-loading");
  elements.loading.hidden = false;
  elements.loading.textContent = "Loading poster…";
  elements.title.textContent = poster.title;
  elements.counter.textContent = `${state.index + 1} / ${state.posters.length}`;
  elements.image.alt = poster.title;
  elements.image.onload = finishImageLoad;
  elements.image.onerror = () => {
    elements.loading.hidden = false;
    elements.loading.textContent = "Poster image could not be loaded";
  };
  elements.image.src = poster.image;

  if (elements.image.complete && elements.image.naturalWidth > 0) finishImageLoad();
  buildDots();
  preloadNeighborPosters();
}

function shiftPoster(amount) {
  if (state.posters.length < 2) return;
  state.index = (state.index + amount + state.posters.length) % state.posters.length;
  renderPoster(amount > 0 ? "next" : "previous");
}

function goToPoster(index) {
  if (index === state.index) return;
  const direction = index > state.index ? "next" : "previous";
  state.index = index;
  renderPoster(direction);
}

function handleKeydown(event) {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    shiftPoster(1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    shiftPoster(-1);
  }
}

function addInteractions() {
  elements.previous.addEventListener("click", () => shiftPoster(-1));
  elements.next.addEventListener("click", () => shiftPoster(1));
  document.addEventListener("keydown", handleKeydown);

  elements.stage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    state.dragStartX = event.clientX;
    state.pointerId = event.pointerId;
    elements.stage.classList.add("is-dragging");
    elements.stage.setPointerCapture(event.pointerId);
  });

  elements.stage.addEventListener("pointerup", (event) => {
    if (state.dragStartX === null) return;
    const distance = event.clientX - state.dragStartX;
    elements.stage.classList.remove("is-dragging");
    if (elements.stage.hasPointerCapture(state.pointerId)) {
      elements.stage.releasePointerCapture(state.pointerId);
    }
    state.dragStartX = null;
    state.pointerId = null;

    if (Math.abs(distance) >= 42) shiftPoster(distance < 0 ? 1 : -1);
  });

  elements.stage.addEventListener("pointercancel", () => {
    state.dragStartX = null;
    state.pointerId = null;
    elements.stage.classList.remove("is-dragging");
  });
}

async function initialize() {
  addInteractions();
  state.posters = shuffle(await loadPosters());

  if (state.posters.length === 0) {
    elements.loading.textContent = "No posters are available";
    elements.counter.textContent = "0 / 0";
    return;
  }

  renderPoster();
}

initialize();
