// Footer year
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============ Scroll reveal ============
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// ============ Hero headline reveal on load ============
const heroTitle = document.querySelector(".hero-title");
if (heroTitle) {
  requestAnimationFrame(() => heroTitle.classList.add("in"));
}

// ============ Custom cursor dot ============
const cursor = document.querySelector(".cursor-glow");
if (cursor && window.matchMedia("(hover: hover)").matches && !reduceMotion) {
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx;
  let ty = cy;

  document.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  const loop = () => {
    cx += (tx - cx) * 0.25;
    cy += (ty - cy) * 0.25;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  // Grow on interactive elements
  document.querySelectorAll("a, button, .button").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      cursor.style.width = "48px";
      cursor.style.height = "48px";
    });
    el.addEventListener("pointerleave", () => {
      cursor.style.width = "18px";
      cursor.style.height = "18px";
    });
  });
}
