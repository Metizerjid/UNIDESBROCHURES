// -----------------------------------------------------------------------------
// POSTER DATA
// Add your public API endpoint to POSTER_API_URL when it is ready. The endpoint
// may return either an array or { posters: [...] }. Each poster needs an image
// URL in `image`, `imageUrl`, `url`, or `src`; `title` is optional.
// Leave the URL empty to use the local sample posters below.
// -----------------------------------------------------------------------------

const POSTER_API_URL = "";

const localPosterGroups = {
  "class-one": [
    {
      id: "01",
      kicker: "Patterns & play",
      title: "Numbers in Nature",
      description: "A visual introduction to counting, patterns, and the surprising mathematics hiding in the natural world.",
      pages: "12 pages",
      image: "assets/brochures/01-numbers-in-nature.svg",
      pdf: "",
    },
    {
      id: "02",
      kicker: "Words & imagination",
      title: "First Readers",
      description: "Friendly prompts, short stories, and playful activities created to make early reading feel like discovery.",
      pages: "16 pages",
      image: "assets/brochures/02-first-readers.svg",
      pdf: "",
    },
    {
      id: "03",
      kicker: "People & places",
      title: "Our Shared World",
      description: "An inviting tour of families, neighborhoods, and the many ways communities learn and grow together.",
      pages: "10 pages",
      image: "assets/brochures/03-our-shared-world.svg",
      pdf: "",
    },
  ],
  "class-two": [
    {
      id: "04",
      kicker: "Questions & evidence",
      title: "Young Scientists",
      description: "Simple experiments and observation guides that turn everyday curiosity into a practical science habit.",
      pages: "14 pages",
      image: "assets/brochures/04-young-scientists.svg",
      pdf: "",
    },
    {
      id: "05",
      kicker: "Language & form",
      title: "Stories & Structure",
      description: "A clear, creative guide to characters, sequence, and the building blocks behind memorable stories.",
      pages: "12 pages",
      image: "assets/brochures/05-stories-and-structure.svg",
      pdf: "",
    },
    {
      id: "06",
      kicker: "Space & belonging",
      title: "Maps & Communities",
      description: "Learn how maps tell stories about movement, place, resources, and the communities around us.",
      pages: "18 pages",
      image: "assets/brochures/06-maps-and-communities.svg",
      pdf: "",
    },
  ],
  "class-three": [
    {
      id: "07",
      kicker: "Make & improve",
      title: "The Design Lab",
      description: "A hands-on process for noticing a problem, sketching possibilities, testing ideas, and improving them.",
      pages: "16 pages",
      image: "assets/brochures/07-design-lab.svg",
      pdf: "",
    },
    {
      id: "08",
      kicker: "Life & connection",
      title: "Living Systems",
      description: "Explore food webs, habitats, and the quiet connections that help ecosystems stay in balance.",
      pages: "20 pages",
      image: "assets/brochures/08-living-systems.svg",
      pdf: "",
    },
    {
      id: "09",
      kicker: "Memory & meaning",
      title: "Voices in History",
      description: "A source-based approach to understanding the past through letters, objects, images, and lived experience.",
      pages: "14 pages",
      image: "assets/brochures/09-voices-in-history.svg",
      pdf: "",
    },
  ],
  "class-four": [
    {
      id: "10",
      kicker: "Imagine & build",
      title: "Future Makers",
      description: "Creative challenges that connect technology, teamwork, and thoughtful choices about the future.",
      pages: "18 pages",
      image: "assets/brochures/10-future-makers.svg",
      pdf: "",
    },
    {
      id: "11",
      kicker: "Climate & choices",
      title: "Earth & Energy",
      description: "A practical look at energy, climate systems, and the choices that shape a more resilient planet.",
      pages: "22 pages",
      image: "assets/brochures/11-earth-and-energy.svg",
      pdf: "",
    },
    {
      id: "12",
      kicker: "Think & communicate",
      title: "Ideas into Action",
      description: "A toolkit for researching a question, forming a point of view, and sharing it with clarity and purpose.",
      pages: "16 pages",
      image: "assets/brochures/12-ideas-into-action.svg",
      pdf: "",
    },
  ],
};

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

async function loadPosters() {
  if (POSTER_API_URL) {
    try {
      const response = await fetch(POSTER_API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Poster API returned ${response.status}`);
      const payload = await response.json();
      const records = Array.isArray(payload) ? payload : payload.posters;
      if (!Array.isArray(records)) throw new Error("Poster API response must contain a posters array");

      const posters = records.map(normalizePoster).filter(Boolean);
      if (posters.length === 0) throw new Error("Poster API returned no usable image URLs");
      return posters;
    } catch (error) {
      console.warn("Poster API could not be loaded; using local fallback posters.", error);
    }
  }

  return Object.values(localPosterGroups).flat().map(normalizePoster).filter(Boolean);
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
