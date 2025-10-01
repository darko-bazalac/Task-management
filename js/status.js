// Handle task status updates
export function setStatus(statusCell, newStatus) {
  if (!statusCell) return;
  let span = statusCell.querySelector("span");
  if (!span) {
    span = document.createElement("span");
    statusCell.appendChild(span);
  }

  span.classList.remove("status-assign", "status-todo");

  if (newStatus === "To assign") {
    span.textContent = "To assign";
    span.classList.add("status-assign");
  } else if (newStatus === "To do") {
    span.textContent = "To do";
    span.classList.add("status-todo");
  }
}
