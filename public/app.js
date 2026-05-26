const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".mode-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const mode = tab.dataset.mode;
    document.getElementById(`${mode}-mode`).classList.add("active");
  });
});

function showResults(html) {
  const section = document.getElementById("results");
  const content = document.getElementById("results-content");
  content.innerHTML = html;
  section.classList.remove("hidden");
}

document.getElementById("filters-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const params = Object.fromEntries(form.entries());

  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    showResults(
      `<p>✅ API conectada — status: <strong>${data.status}</strong></p>
       <p>Filtros enviados: ${JSON.stringify(params)}</p>`
    );
  } catch (err) {
    showResults(`<p>❌ Error: ${err.message}</p>`);
  }
});

document.getElementById("prompt-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const params = Object.fromEntries(form.entries());

  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    showResults(
      `<p>✅ API conectada — status: <strong>${data.status}</strong></p>
       <p>Prompt: "${params.prompt}"</p>`
    );
  } catch (err) {
    showResults(`<p>❌ Error: ${err.message}</p>`);
  }
});
