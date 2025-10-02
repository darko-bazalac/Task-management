let activeAssignee = null;
export function updateAssigneeCounter() {
  const tbody = document.querySelector("#tasksTable tbody");

  // Assigned
  const assigneeCells = Array.from(
    tbody.querySelectorAll("td:nth-child(9) .bubble"),
  );
  const assignedSet = new Set();
  const counts = {};

  assigneeCells.forEach(cell => {
    const assignee = cell.innerText.trim();
    if (assignee && assignee !== "+") {
      counts[assignee] = (counts[assignee] || 0) + 1;
      assignedSet.add(assignee);
    }
  });

  // Interested
  const interestedCells = Array.from(
    tbody.querySelectorAll("td:nth-child(10) .bubble"),
  );
  const interestedSet = new Set();
  interestedCells.forEach(cell => {
    const interested = cell.innerText.trim();
    if (interested && interested !== "+") {
      interestedSet.add(interested);
    }
  });

  const container = document.querySelector(".assignee-counter");
  container.innerHTML = "";

  // Add unique counts before bubbles
  const stats = document.createElement("div");
  stats.className = "assignee-stats";
  stats.innerHTML = `
    <span class="stat interested">Interested: ${interestedSet.size}</span>
    <span class="stat assigned">Assigned: ${assignedSet.size}</span>
  `;
  container.appendChild(stats);

  // Add assignee bubbles sorted by count
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([initials, count]) => {
      const bubble = document.createElement("div");
      bubble.className = "assignee-bubble";

      // Apply selected state if this is the active one
      if (activeAssignee === initials) {
        bubble.classList.add("selected");
      }

      const spanText = document.createElement("span");
      spanText.className = "bubble-text";
      spanText.textContent = initials;

      const spanCount = document.createElement("span");
      spanCount.className = "task-count";
      spanCount.textContent = count;

      bubble.appendChild(spanText);
      bubble.appendChild(spanCount);
      container.appendChild(bubble);

      bubble.addEventListener("click", () => {
        if (activeAssignee === initials) {
          // deselect -> reset
          activeAssignee = null;
          resetFilter();
        } else {
          activeAssignee = initials;
          filterByAssignee(initials);
        }
        updateAssigneeCounter(); // redraw bubbles with new state
      });
    });
}

function filterByAssignee(initials) {
  const tbody = document.querySelector("#tasksTable tbody");
  Array.from(tbody.querySelectorAll("tr")).forEach(row => {
    const assigneeBubble = row.querySelector("td:nth-child(9) .bubble");
    if (assigneeBubble && assigneeBubble.innerText.trim() === initials) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function resetFilter() {
  const tbody = document.querySelector("#tasksTable tbody");
  Array.from(tbody.querySelectorAll("tr")).forEach(row => {
    row.style.display = ""; // show all again
  });
}
