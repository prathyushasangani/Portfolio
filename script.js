// Footer year
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// ============ Tech chip icon injection ============
// Simple Icons CDN — https://cdn.simpleicons.org/<slug>/<hex>
// Slug + hex color pairs for each tech (color chosen for legibility on dark bg)
const ICON_MAP = {
  "python": ["python", "3776ab"],
  "java": ["openjdk", "ffffff"],
  "javascript": ["javascript", "f7df1e"],
  "typescript": ["typescript", "3178c6"],
  "sql": ["mysql", "4479a1"],
  "react": ["react", "61dafb"],
  "react.js": ["react", "61dafb"],
  "next.js": ["nextdotjs", "ffffff"],
  "html": ["html5", "e34f26"],
  "css": ["css3", "1572b6"],
  "tailwindcss": ["tailwindcss", "06b6d4"],
  "node.js": ["nodedotjs", "5fa04e"],
  "express.js": ["express", "ffffff"],
  "flask": ["flask", "ffffff"],
  "spring boot": ["spring", "6db33f"],
  "rest apis": ["swagger", "85ea2d"],
  "generative ai": ["openai", "ffffff"],
  "llms": ["openai", "ffffff"],
  "llm apis": ["openai", "ffffff"],
  "prompt engineering": ["openai", "ffffff"],
  "agentic ai": ["openai", "ffffff"],
  "mcp": ["anthropic", "ffffff"],
  "langchain": ["langchain", "ffffff"],
  "langgraph": ["langchain", "ffffff"],
  "rag pipelines": ["huggingface", "ffd21e"],
  "ollama": ["ollama", "ffffff"],
  "pinecone": ["pinecone", "ffffff"],
  "chromadb": ["chromadb", "ffffff"],
  "microsoft azure": ["microsoftazure", "0078d4"],
  "aws": ["amazonwebservices", "ff9900"],
  "docker": ["docker", "2496ed"],
  "kubernetes": ["kubernetes", "326ce5"],
  "helm": ["helm", "0f1689"],
  "terraform": ["terraform", "7b42bc"],
  "jenkins": ["jenkins", "d24939"],
  "gitops": ["argo", "ef7b4d"],
  "ci/cd": ["githubactions", "2088ff"],
  "azure devops": ["azuredevops", "0078d7"],
  "git": ["git", "f05032"],
  "postgresql": ["postgresql", "4169e1"],
  "neon postgresql": ["postgresql", "4169e1"],
  "sql server": ["microsoftsqlserver", "cc2927"],
  "mongodb": ["mongodb", "47a248"],
  "firebase firestore": ["firebase", "ffca28"],
  "firebase auth": ["firebase", "ffca28"],
  "firebase functions": ["firebase", "ffca28"],
  "streamlit": ["streamlit", "ff4b4b"],
  "youtube transcript api": ["youtube", "ff0000"],
  "vercel": ["vercel", "ffffff"],
  "capacitor ios": ["capacitor", "119eff"],
  "abacus ai api": ["openai", "ffffff"],
  "web speech api": ["googlechrome", "4285f4"],
  "web audio api": ["googlechrome", "4285f4"],
  "pypdf": ["adobeacrobatreader", "ec1c24"],
  "python-docx": ["microsoftword", "2b579a"],
  "tf-idf": ["scikitlearn", "f7931e"],
  "cosine similarity": ["scikitlearn", "f7931e"],
};

document.querySelectorAll(".chip").forEach((chip) => {
  const key = chip.textContent.trim().toLowerCase();
  const entry = ICON_MAP[key];
  if (!entry) {
    chip.classList.add("no-icon");
    return;
  }
  const [slug, color] = entry;
  const img = document.createElement("img");
  img.src = `https://cdn.simpleicons.org/${slug}/${color}`;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.width = 18;
  img.height = 18;
  img.onerror = () => {
    img.remove();
    chip.classList.add("no-icon");
  };
  chip.prepend(img);
});

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
