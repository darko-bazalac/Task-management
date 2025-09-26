document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const tbody = document.querySelector("#tasksTable tbody");

  searchInput.addEventListener("keyup", () => {
    const search = searchInput.value.toLowerCase();

    Array.from(tbody.querySelectorAll("tr")).forEach(row => {
      const carCell = row.querySelector("td:nth-child(2)"); // Car column
      const carText = carCell.textContent.toLowerCase();

      // Show row if search matches any part of car cell (plate or model)
      if (carText.includes(search)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

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

function enableAssignment() {
  const table = document.getElementById("tasksTable");
  const tbody = table.querySelector("tbody");

  tbody.addEventListener("click", e => {
    if (!e.target.classList.contains("bubble")) return;

    const clickedBubble = e.target;
    const row = clickedBubble.closest("tr"); // define row first
    const statusCell = row.querySelector("td.status"); // find the status cell
    const initials = clickedBubble.innerText.trim();
    const assigneeCell = row.querySelector("td:nth-child(9) .bubbles");
    const interestedCell = row.querySelector("td:nth-child(10) .bubbles");
    const currentAssignee = assigneeCell
      .querySelector(".bubble")
      .innerText.trim();

    // ✅ Case 1: Click on Interested bubble → Assign
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

        // ✅ update status
        setStatus(statusCell, "To do");

        updateAssigneeCounter();
      }
    }

    // ✅ Case 2: Click on Assignee bubble → Remove
    else if (assigneeCell.contains(clickedBubble) && initials !== "+") {
      if (confirm(`Remove assignment from ${initials}?`)) {
        const oldBubble = document.createElement("span");
        oldBubble.className = "bubble";
        oldBubble.textContent = initials;
        interestedCell.appendChild(oldBubble);

        assigneeCell.innerHTML = `<span class="bubble bubble2">+</span>`;

        // ✅ revert status
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

  // find the <span> inside the cell
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
document.addEventListener("DOMContentLoaded", () => {
  enableAssignment();
  updateAssigneeCounter();

  const modal = document.getElementById("taskModal");
  const btn = document.getElementById("createTaskBtn");
  const span = modal.querySelector(".close");
  const form = document.getElementById("taskForm");
  const tbody = document.querySelector("#tasksTable tbody");

  // Open modal
  btn.onclick = () => {
    modal.style.display = "block";
  };

  // Close modal
  span.onclick = () => {
    modal.style.display = "none";
  };
  window.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
  };

  // Submit form
  form.onsubmit = e => {
    e.preventDefault();

    const station = document.getElementById("stationInput").value;
    const car = document.getElementById("carInput").value;
    const type = document.getElementById("typeInput").value;
    const destination = document.getElementById("destinationInput").value;

    // Generate random ID
    const id = Math.floor(10000 + Math.random() * 90000);

    // Default values
    const status = `<span class="status-assign">To assign</span>`;
    const period = new Date().toLocaleDateString();

    // Create new row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td>${car}</td>
      <td>${station}</td>
      <td>${type}</td>
      <td class="status">${status}</td>
      <td><span class="dot-red"></span></td>
      <td>Today</td>
      <td>${period}</td>
      <td><div class="bubbles"><span class="bubble bubble2">+</span></div></td>
      <td><div class="bubbles"></div></td>
      <td>${destination}</td>
      <td></td>
    `;

    tbody.appendChild(row);
    modal.style.display = "none";
    form.reset();
  };
});
