const mobile = window.matchMedia("(max-width: 768px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".profit__grid, .why__grid").forEach((track, index) => {
  const cards = [...track.querySelectorAll(":scope > .profit-card, :scope > .why-card")];
  if (cards.length < 2) return;

  const lead = track.querySelector(":scope > .why-lead");
  const controls = document.createElement("div");
  controls.className = "mobile-slider__dots";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Переключение карточек");
  track.id ||= `mobile-slider-${index + 1}`;
  track.classList.add("mobile-slider");

  const dots = cards.map((card, cardIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "mobile-slider__dot";
    dot.setAttribute("aria-label", `Карточка ${cardIndex + 1} из ${cards.length}`);
    dot.setAttribute("aria-controls", track.id);
    dot.addEventListener("click", () => {
      track.scrollTo({
        left: track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    });
    controls.append(dot);
    return dot;
  });
  track.after(controls);

  const updateDots = () => {
    const left = track.getBoundingClientRect().left;
    let active = 0;
    cards.forEach((card, cardIndex) => {
      if (Math.abs(card.getBoundingClientRect().left - left) <
          Math.abs(cards[active].getBoundingClientRect().left - left)) active = cardIndex;
    });
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === active));
    });
  };

  const updateLayout = () => {
    if (lead) {
      if (mobile.matches) track.before(lead);
      else track.prepend(lead);
    }
    controls.hidden = !mobile.matches;
    if (mobile.matches) {
      track.tabIndex = 0;
      track.setAttribute("role", "region");
      track.setAttribute("aria-roledescription", "слайдер");
      track.setAttribute("aria-label", track.closest("section").querySelector("h2").textContent.trim());
    } else {
      track.removeAttribute("tabindex");
      track.removeAttribute("role");
      track.removeAttribute("aria-roledescription");
      track.removeAttribute("aria-label");
      track.scrollLeft = 0;
    }
    updateDots();
  };

  track.addEventListener("scroll", updateDots, { passive: true });
  new ResizeObserver(updateDots).observe(track);
  mobile.addEventListener("change", updateLayout);
  updateLayout();
});
