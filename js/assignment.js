import { setStatus } from "./status.js";
import { updateAssigneeCounter } from "./counter.js";

// Enable task assignment/unassignment
export function enableAssignment() {
  const tbody = document.querySelector("#tasksTable tbody");

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

    // Assign
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
    // Unassign
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
