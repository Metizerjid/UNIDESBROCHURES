// Each QR code opens the same viewer with a different `afis` query parameter.
// The selected page shows every available poster in its own folder, in order.
const posterPages = [
  {
    id: "1",
    title: "Afiş 1",
    path: "assets/posters/klasor-1",
    extensions: ["jpg", "jpeg", "png", "webp", "svg"],
  },
  {
    id: "2",
    title: "Afiş 2",
    path: "assets/posters/klasor-2",
    extensions: ["jpg", "jpeg", "png", "webp", "svg"],
  },
  {
    id: "3",
    title: "Afiş 3",
    path: "assets/posters/klasor-3",
    extensions: ["svg", "jpg", "jpeg", "png", "webp"],
  },
];

const posterSlots = ["poster-1", "poster-2", "poster-3", "poster-4"];

const elements = {
  brand: document.querySelector("#brand-link"),
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

function normalizePoster(item, index) {
  const image = item?.image || item?.imageUrl || item?.url || item?.src;
  if (!image) return null;

  return {
    id: String(item.id ?? index + 1),
    title: item.title || item.name || `Poster ${index + 1}`,
    image,
  };
}

function imageExists(source) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = source;
  });
}

function getSelectedPage() {
  const requestedPage = new URLSearchParams(window.location.search).get("afis") || "1";
  return posterPages.find((page) => page.id === requestedPage) || posterPages[0];
}

async function resolvePoster(page, slot, index) {
  for (const extension of page.extensions) {
    const image = `${page.path}/${slot}.${extension}`;
    if (await imageExists(image)) {
      return normalizePoster(
        {
          id: `${page.id}-${index + 1}`,
          title: `Görsel ${index + 1}`,
          image,
        },
        index,
      );
    }
  }

  return null;
}

async function loadPosters() {
  const page = getSelectedPage();
  document.title = `${page.title} • IEEE SB × UNIDES`;
  elements.brand.href = `?afis=${page.id}`;
  const posters = await Promise.all(
    posterSlots.map((slot, index) => resolvePoster(page, slot, index)),
  );
  return posters.filter(Boolean);
}

function buildDots() {
  elements.dots.replaceChildren(
    ...state.posters.map((poster, index) => {
      const dot = document.createElement("button");
      dot.className = "poster-dot";
      dot.type = "button";
      dot.textContent = `${poster.title} görselini göster`;
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
  elements.loading.textContent = "Görsel yükleniyor…";
  elements.title.textContent = poster.title;
  elements.counter.textContent = `${state.index + 1} / ${state.posters.length}`;
  elements.image.alt = poster.title;
  elements.image.onload = finishImageLoad;
  elements.image.onerror = () => {
    elements.loading.hidden = false;
    elements.loading.textContent = "Görsel yüklenemedi";
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
  state.posters = await loadPosters();

  if (state.posters.length === 0) {
    elements.loading.textContent = "Gösterilecek görsel bulunamadı";
    elements.counter.textContent = "0 / 0";
    return;
  }

  renderPoster();
}

initialize();
