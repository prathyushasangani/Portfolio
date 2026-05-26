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

// ============ 3D tilt on cards ============
const tiltEls = document.querySelectorAll("[data-tilt]");

function applyTilt(el, rx, ry) {
  el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
}

if (!reduceMotion) {
  tiltEls.forEach((el) => {
    let raf = 0;
    let targetRx = 0;
    let targetRy = 0;
    let currentRx = 0;
    let currentRy = 0;

    const animate = () => {
      currentRx += (targetRx - currentRx) * 0.15;
      currentRy += (targetRy - currentRy) * 0.15;
      applyTilt(el, currentRx, currentRy);
      if (Math.abs(targetRx - currentRx) > 0.05 || Math.abs(targetRy - currentRy) > 0.05) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = 0;
      }
    };

    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const max = 12;
      targetRy = (x - 0.5) * max * 2;
      targetRx = -(y - 0.5) * max * 2;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.classList.add("is-hover");
      if (!raf) raf = requestAnimationFrame(animate);
    });

    el.addEventListener("pointerleave", () => {
      targetRx = 0;
      targetRy = 0;
      el.classList.remove("is-hover");
      if (!raf) raf = requestAnimationFrame(animate);
    });
  });
}

// ============ Cursor glow ============
const cursor = document.querySelector(".cursor-glow");
if (cursor && window.matchMedia("(hover: hover)").matches) {
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx;
  let ty = cy;

  document.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  const loop = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  if (!reduceMotion) loop();
}

// ============ Parallax for orbs based on scroll ============
const orbs = document.querySelectorAll(".orb");
if (orbs.length && !reduceMotion) {
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.08;
            orb.style.translate = `0 ${y * speed * -0.3}px`;
          });
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}
