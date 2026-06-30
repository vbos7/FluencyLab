// Progresso das tarefas guardado no localStorage do navegador.
// Cada pessoa do time vê o próprio progresso na própria máquina —
// não precisa de backend pra isso.

const STORAGE_KEY = "fluencylab-tarefas-progress";

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function setTaskDone(taskId, done) {
  const progress = getProgress();
  if (done) {
    progress[taskId] = true;
  } else {
    delete progress[taskId];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

// ---- página índice ----

function initIndexPage() {
  const cards = document.querySelectorAll(".task-card[data-task]");
  if (!cards.length) return;

  const progress = getProgress();

  function updateSummary() {
    const all = Array.from(cards).filter((c) => !c.dataset.optional);
    const done = all.filter((c) => getProgress()[c.dataset.task]).length;
    const total = all.length;
    const bar = document.getElementById("progress-bar-fill");
    const count = document.getElementById("progress-count");
    if (bar) bar.style.width = total ? `${(done / total) * 100}%` : "0%";
    if (count) count.textContent = `${done} / ${total} tarefas concluídas`;
  }

  cards.forEach((card) => {
    const taskId = card.dataset.task;
    const checkbox = card.querySelector(".task-checkbox");
    if (!checkbox) return;

    checkbox.checked = !!progress[taskId];

    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    checkbox.addEventListener("change", () => {
      setTaskDone(taskId, checkbox.checked);
      updateSummary();
    });
  });

  updateSummary();
}

// ---- página de tarefa ----

function initTaskPage() {
  const btn = document.getElementById("mark-done-btn");
  if (!btn) return;

  const taskId = btn.dataset.task;

  function render() {
    const done = !!getProgress()[taskId];
    btn.classList.toggle("done", done);
    btn.textContent = done ? "✓ Concluído" : "Marcar como concluído";
  }

  btn.addEventListener("click", () => {
    const currentlyDone = !!getProgress()[taskId];
    setTaskDone(taskId, !currentlyDone);
    render();
  });

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initIndexPage();
  initTaskPage();
});
