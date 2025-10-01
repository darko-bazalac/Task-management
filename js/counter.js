// Count assigned tasks per assignee
export function updateAssigneeCounter() {
  const tbody = document.querySelector("#tasksTable tbody");
  const assigneeCells = Array.from(
    tbody.querySelectorAll("td:nth-child(9) .bubble"),
  );

  const counts = {};
  assigneeCells.forEach(cell => {
    const assignee = cell.innerText.trim();
    if (assignee && assignee !== "+") {
      counts[assignee] = (counts[assignee] || 0) + 1;
    }
  });

  const container = document.querySelector(".assignee-counter");
  container.innerHTML = "";

  Object.entries(counts)
    .sort((a, b) => b[1] - a[1]) // Sort by most tasks
    .forEach(([initials, count]) => {
      const bubble = document.createElement("div");
      bubble.className = "assignee-bubble";

      const spanText = document.createElement("span");
      spanText.className = "bubble-text";
      spanText.textContent = initials;

      const spanCount = document.createElement("span");
      spanCount.className = "task-count";
      spanCount.textContent = count;

      bubble.appendChild(spanText);
      bubble.appendChild(spanCount);
      container.appendChild(bubble);
    });
}
