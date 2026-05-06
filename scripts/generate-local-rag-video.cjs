const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "assets");
const outPath = path.join(outDir, "local-rag-demo.webm");

fs.mkdirSync(outDir, { recursive: true });

const html = String.raw`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        background: #0f1d19;
      }
      canvas {
        display: block;
        width: 1280px;
        height: 720px;
      }
    </style>
  </head>
  <body>
    <canvas id="stage" width="1280" height="720"></canvas>
    <script>
      const canvas = document.querySelector("#stage");
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const fps = 30;
      const duration = 19;
      const totalFrames = fps * duration;

      function ease(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }

      function roundedRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }

      function fillRound(x, y, w, h, r, fill, stroke) {
        roundedRect(x, y, w, h, r);
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      function text(value, x, y, size, color, weight = 600, align = "left") {
        ctx.fillStyle = color;
        ctx.font = weight + " " + size + "px Inter, Arial, sans-serif";
        ctx.textAlign = align;
        ctx.textBaseline = "top";
        ctx.fillText(value, x, y);
      }

      function wrapped(value, x, y, maxWidth, lineHeight, size, color, weight = 500) {
        ctx.font = weight + " " + size + "px Inter, Arial, sans-serif";
        ctx.fillStyle = color;
        ctx.textBaseline = "top";
        const words = value.split(" ");
        let line = "";
        let offset = 0;
        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (ctx.measureText(test).width > maxWidth && line) {
            ctx.fillText(line, x, y + offset);
            line = word;
            offset += lineHeight;
          } else {
            line = test;
          }
        }
        if (line) ctx.fillText(line, x, y + offset);
      }

      function pill(label, x, y, color) {
        ctx.font = "700 20px Inter, Arial, sans-serif";
        const width = ctx.measureText(label).width + 34;
        fillRound(x, y, width, 42, 21, color, "rgba(255,255,255,0.22)");
        text(label, x + 17, y + 9, 18, "#ffffff", 800);
        return width;
      }

      function arrow(x1, y1, x2, y2, progress, color = "#147f8a") {
        const px = x1 + (x2 - x1) * progress;
        const py = y1 + (y2 - y1) * progress;
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(px, py);
        ctx.stroke();
        if (progress > 0.92) {
          const angle = Math.atan2(y2 - y1, x2 - x1);
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - 18 * Math.cos(angle - 0.55), y2 - 18 * Math.sin(angle - 0.55));
          ctx.lineTo(x2 - 18 * Math.cos(angle + 0.55), y2 - 18 * Math.sin(angle + 0.55));
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      function background(frame) {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "#e7f3f5");
        g.addColorStop(0.56, "#f8f5ee");
        g.addColorStop(1, "#fff6e8");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = "#1e5b4d";
        ctx.lineWidth = 1;
        for (let x = -120; x < W + 120; x += 70) {
          ctx.beginPath();
          ctx.moveTo(x + (frame % 90), 0);
          ctx.lineTo(x - 260 + (frame % 90), H);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      function shell() {
        fillRound(110, 92, 1060, 538, 18, "#ffffff", "#dce5ef");
        fillRound(110, 92, 1060, 64, 18, "#13231f");
        ctx.fillStyle = "#d85d47"; ctx.beginPath(); ctx.arc(142, 124, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#c59428"; ctx.beginPath(); ctx.arc(168, 124, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#58b58c"; ctx.beginPath(); ctx.arc(194, 124, 8, 0, Math.PI * 2); ctx.fill();
        text("Local RAG Chat", 226, 108, 26, "#eef7f1", 800);
      }

      function sidebar(progress) {
        fillRound(134, 180, 282, 408, 10, "#fbfcfe", "#e1e7ef");
        text("Knowledge", 160, 206, 27, "#17212f", 800);
        text("Ollama model", 160, 262, 16, "#617068", 700);
        fillRound(160, 292, 218, 44, 8, "#ffffff", "#d8e0ea");
        text("ollama3:1b", 178, 304, 18, "#17212f", 700);
        text("Website or YouTube link", 160, 362, 16, "#617068", 700);
        fillRound(160, 392, 218, 44, 8, "#ffffff", "#d8e0ea");
        const typed = "https://docs.example.com".slice(0, Math.floor(24 * progress));
        text(typed, 176, 404, 16, "#17212f", 600);
        text("Files", 160, 464, 16, "#617068", 700);
        fillRound(160, 494, 218, 58, 8, "#f5f7fb", "#d8e0ea");
        text("PDF  DOCX  TXT  MD", 178, 514, 15, "#617068", 700);
      }

      function chatEmpty() {
        text("WELCOME", 672, 334, 72, "#1d2939", 800, "center");
        fillRound(472, 520, 560, 54, 27, "#ffffff", "#d9e2ec");
        text("Ask something from the link or document...", 504, 537, 19, "#8a96a7", 500);
      }

      function pipeline(progress) {
        const y = 382;
        const xs = [248, 474, 700, 926];
        const labels = ["Source", "Chunks", "Retrieve", "Ollama"];
        const sub = ["links + files", "clean text", "top context", "local answer"];
        for (let i = 0; i < xs.length; i++) {
          const show = Math.min(1, Math.max(0, progress * 4 - i));
          ctx.globalAlpha = show;
          fillRound(xs[i] - 76, y - 62, 152, 124, 12, "#ffffff", "#dce5ef");
          text(labels[i], xs[i], y - 34, 24, "#17211b", 800, "center");
          text(sub[i], xs[i], y + 10, 15, "#617068", 700, "center");
          ctx.globalAlpha = 1;
          if (i < xs.length - 1) arrow(xs[i] + 86, y, xs[i + 1] - 86, y, Math.min(1, Math.max(0, progress * 4 - i - 0.2)));
        }
      }

      function conversation(progress) {
        fillRound(454, 190, 642, 392, 12, "#f7fafc", "#dce5ef");
        const userShow = Math.min(1, progress * 2);
        const answerShow = Math.min(1, Math.max(0, progress * 2 - 0.8));
        ctx.globalAlpha = userShow;
        fillRound(684, 236, 354, 76, 18, "#2563eb", null);
        wrapped("What are the key points from this document?", 710, 254, 306, 25, 19, "#ffffff", 700);
        ctx.globalAlpha = answerShow;
        fillRound(498, 354, 472, 138, 18, "#ffffff", "#e3e8f0");
        wrapped("I found the most relevant chunks and answered only from the uploaded source. Local Ollama keeps the workflow private.", 526, 378, 416, 27, 20, "#17212f", 650);
        ctx.globalAlpha = 1;
      }

      function draw(frame) {
        background(frame);
        const t = frame / fps;
        shell();

        if (t < 3.4) {
          text("local-rag", 640, 214, 72, "#17211b", 900, "center");
          wrapped("A local Streamlit app that reads websites, YouTube transcripts, PDFs, DOCX, TXT, MD, and CSV files.", 282, 318, 716, 32, 24, "#41534a", 600);
          pill("Streamlit", 373, 442, "#1e5b4d");
          pill("TF-IDF Retriever", 520, 442, "#147f8a");
          pill("Ollama", 735, 442, "#d85d47");
        } else if (t < 7.6) {
          const p = ease((t - 3.4) / 4.2);
          sidebar(p);
          chatEmpty();
          text("1. Add knowledge", 640, 186, 34, "#17211b", 850, "center");
        } else if (t < 11.6) {
          const p = ease((t - 7.6) / 4);
          text("2. Chunk, index, and retrieve", 640, 206, 40, "#17211b", 850, "center");
          wrapped("Text is cleaned into overlapping chunks. A small TF-IDF retriever scores the best context for each question.", 280, 272, 720, 30, 23, "#41534a", 600);
          pipeline(p);
        } else if (t < 16.2) {
          const p = ease((t - 11.6) / 4.6);
          sidebar(1);
          conversation(p);
          text("3. Ask locally", 640, 186, 34, "#17211b", 850, "center");
        } else {
          text("Private knowledge. Local answers.", 640, 238, 54, "#17211b", 900, "center");
          wrapped("local-rag connects document reading, retrieval, and Ollama into one practical RAG workflow.", 288, 334, 704, 34, 26, "#41534a", 600);
          fillRound(493, 458, 294, 58, 8, "#1e5b4d", null);
          text("View project on GitHub", 640, 474, 22, "#ffffff", 850, "center");
        }
      }

      async function record() {
        const stream = canvas.captureStream(fps);
        const type = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";
        const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 2400000 });
        const chunks = [];
        recorder.ondataavailable = event => {
          if (event.data.size) chunks.push(event.data);
        };
        const done = new Promise(resolve => recorder.onstop = resolve);
        recorder.start();

        for (let frame = 0; frame < totalFrames; frame++) {
          draw(frame);
          await new Promise(resolve => setTimeout(resolve, 1000 / fps));
        }

        recorder.stop();
        await done;
        const blob = new Blob(chunks, { type });
        const buffer = await blob.arrayBuffer();
        const bytes = Array.from(new Uint8Array(buffer));
        return bytes;
      }

      window.startRecording = record;
    </script>
  </body>
</html>`;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  const bytes = await page.evaluate(() => window.startRecording());
  await browser.close();
  fs.writeFileSync(outPath, Buffer.from(bytes));
  console.log(outPath);
})();
