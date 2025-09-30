//Search funcionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchBox");
  const tbody = document.querySelector("#tasksTable tbody");

  searchInput.addEventListener("keyup", () => {
    const search = searchInput.value.toLowerCase();
    console.log("Keyup");
    Array.from(tbody.querySelectorAll("tr")).forEach(row => {
      const carCell = row.querySelector("td:nth-child(2)");
      const carText = carCell.textContent.toLowerCase();
      if (carText.includes(search)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});
//Assigned Counter
function updateAssigneeCounter() {
  const table = document.getElementById("tasksTable");
  const tbody = table.querySelector("tbody");
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

  Object.entries(counts).forEach(([initials, count]) => {
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

// run once on load
function updateAssigneeCounter() {
  const table = document.getElementById("tasksTable");
  const tbody = table.querySelector("tbody");
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

  // Sort by count (highest first)
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
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
//Assigne and deassigne
function enableAssignment() {
  const table = document.getElementById("tasksTable");
  const tbody = table.querySelector("tbody");

  tbody.addEventListener("click", e => {
    if (!e.target.classList.contains("bubble")) return;

    const clickedBubble = e.target;
    const row = clickedBubble.closest("tr");
    const statusCell = row.querySelector("td.status");
    const initials = clickedBubble.innerText.trim();
    const assigneeCell = row.querySelector("td:nth-child(9) .bubbles");
    const interestedCell = row.querySelector("td:nth-child(10) .bubbles");
    const currentAssignee = assigneeCell
      .querySelector(".bubble")
      .innerText.trim();

    // Case 1: Click on Interested bubble → Assign
    if (interestedCell.contains(clickedBubble)) {
      if (confirm(`Assign task to ${initials}?`)) {
        if (currentAssignee !== "+") {
          const oldBubble = document.createElement("span");
          oldBubble.className = "bubble";
          oldBubble.textContent = currentAssignee;
          interestedCell.appendChild(oldBubble);
        }
        assigneeCell.innerHTML = `<span class="bubble">${initials}</span>`;
        clickedBubble.remove();
        setStatus(statusCell, "To do");

        updateAssigneeCounter();
      }
    }

    //Case 2: Click on Assignee bubble → Remove
    else if (assigneeCell.contains(clickedBubble) && initials !== "+") {
      if (confirm(`Remove assignment from ${initials}?`)) {
        const oldBubble = document.createElement("span");
        oldBubble.className = "bubble";
        oldBubble.textContent = initials;
        interestedCell.appendChild(oldBubble);
        assigneeCell.innerHTML = `<span class="bubble bubble2">+</span>`;
        setStatus(statusCell, "To assign");
        updateAssigneeCounter();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  enableAssignment();
  updateAssigneeCounter();
});
function setStatus(statusCell, newStatus) {
  if (!statusCell) return;
  let span = statusCell.querySelector("span");
  if (!span) {
    span = document.createElement("span");
    statusCell.appendChild(span);
  }

  // clear old classes
  span.classList.remove("status-assign", "status-todo");

  // set new text and class
  if (newStatus === "To assign") {
    span.textContent = "To assign";
    span.classList.add("status-assign");
  } else if (newStatus === "To do") {
    span.textContent = "To do";
    span.classList.add("status-todo");
  }
}
