import { initSearch } from "./search.js";
import { updateAssigneeCounter } from "./counter.js";
import { enableAssignment } from "./assignment.js";

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  enableAssignment();
  updateAssigneeCounter();
});
