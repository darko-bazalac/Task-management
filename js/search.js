// Search functionality (filter by plates)
export function initSearch() {
  const searchInput = document.getElementById("searchBox");
  const tbody = document.querySelector("#tasksTable tbody");

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    Array.from(tbody.querySelectorAll("tr")).forEach(row => {
      const carCell = row.querySelector("td:nth-child(2)");
      const carText = carCell.textContent.toLowerCase();
      row.style.display = carText.includes(search) ? "" : "none";
    });
  }

  searchInput.addEventListener("keyup", debounce(filterTable, 600));
}
