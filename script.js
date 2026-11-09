// -----------------------------------------------------------------------------
// BROCHURE CONTENT
// Edit this one list to change titles, descriptions, cover images, and PDFs.
// To activate a PDF button, add the file inside assets/pdfs/ and set `pdf` to
// that relative path, for example: "assets/pdfs/numbers-in-nature.pdf".
// -----------------------------------------------------------------------------

const brochureClasses = {
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

const carouselStates = new Map();
const cardTemplate = document.querySelector("#brochure-card-template");

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

function rotate(items, offset) {
  const safeOffset = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(safeOffset), ...items.slice(0, safeOffset)];
}

function buildCard(brochure) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const image = card.querySelector(".brochure-image");
  const action = card.querySelector(".brochure-action");

  image.src = brochure.image;
  image.alt = `${brochure.title} poster placeholder`;
  card.querySelector(".brochure-number").textContent = brochure.id;
  card.querySelector(".brochure-kicker").textContent = brochure.kicker;
  card.querySelector(".brochure-title").textContent = brochure.title;
  card.querySelector(".brochure-description").textContent = brochure.description;
  card.querySelector(".brochure-pages").textContent = brochure.pages;

  if (brochure.pdf) {
    const link = document.createElement("a");
    link.className = "brochure-link";
    link.href = brochure.pdf;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open poster PDF";
    link.setAttribute("aria-label", `Open ${brochure.title} poster PDF in a new tab`);
    action.append(link);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "brochure-link-disabled";
    placeholder.textContent = "Optional PDF not added";
    placeholder.title = "Optionally add a PDF path for this poster in script.js";
    action.append(placeholder);
  }

  return card;
}

function renderCarousel(section, direction = "") {
  const key = section.dataset.carousel;
  const state = carouselStates.get(key);
  const orderedItems = rotate(state.items, state.offset);
  const track = section.querySelector(".carousel-track");
  const status = section.querySelector(".carousel-status");
  const dots = section.querySelector(".carousel-dots");

  // Only the active poster is rendered. The other two stay in state and become
  // available when the visitor uses an arrow, keyboard, swipe, or drag control.
  track.replaceChildren(buildCard(orderedItems[0]));
  track.className = `carousel-track${direction ? ` is-${direction}` : ""}`;
  status.textContent = `Poster ${state.offset + 1} of ${state.items.length}`;

  dots.replaceChildren(
    ...state.items.map((item, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.textContent = `Show ${item.title} poster`;
      dot.setAttribute("aria-current", String(index === state.offset));
      dot.addEventListener("click", () => {
        const previousOffset = state.offset;
        state.offset = index;
        renderCarousel(section, index >= previousOffset ? "next" : "previous");
      });
      return dot;
    }),
  );
}

function shiftCarousel(section, amount) {
  const state = carouselStates.get(section.dataset.carousel);
  state.offset = (state.offset + amount + state.items.length) % state.items.length;
  renderCarousel(section, amount > 0 ? "next" : "previous");
}

function addDragControls(section) {
  const viewport = section.querySelector(".carousel-viewport");
  let startX = null;
  let pointerId = null;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    startX = event.clientX;
    pointerId = event.pointerId;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(pointerId);
  });

  viewport.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    viewport.classList.remove("is-dragging");
    if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
    startX = null;
    pointerId = null;

    if (Math.abs(distance) >= 42) {
      shiftCarousel(section, distance < 0 ? 1 : -1);
    }
  });

  viewport.addEventListener("pointercancel", () => {
    startX = null;
    pointerId = null;
    viewport.classList.remove("is-dragging");
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      shiftCarousel(section, 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      shiftCarousel(section, -1);
    }
  });
}

function initializeCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((section) => {
    const key = section.dataset.carousel;
    carouselStates.set(key, {
      items: shuffle(brochureClasses[key]),
      offset: 0,
    });

    section.querySelector(".previous").addEventListener("click", () => shiftCarousel(section, -1));
    section.querySelector(".next").addEventListener("click", () => shiftCarousel(section, 1));
    addDragControls(section);
    renderCarousel(section);
  });
}

function shuffleAllCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((section) => {
    const state = carouselStates.get(section.dataset.carousel);
    state.items = shuffle(state.items);
    state.offset = 0;
    renderCarousel(section, "next");
  });

  const shuffleButton = document.querySelector("#shuffle-all");
  const originalLabel = shuffleButton.lastChild.textContent;
  shuffleButton.lastChild.textContent = " Shuffled!";
  window.setTimeout(() => {
    shuffleButton.lastChild.textContent = originalLabel;
  }, 1200);
}

initializeCarousels();
document.querySelector("#shuffle-all").addEventListener("click", shuffleAllCarousels);
