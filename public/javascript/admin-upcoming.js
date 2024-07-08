document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addBtn");
  const formPopup = document.getElementById("formPopup");
  const closeBtn = document.getElementById("closeBtn");

  const editFormPopup = document.getElementById("editFormPopup");
  const closeEditBtn = document.getElementById("closeEditBtn");
  const editForm = document.getElementById("editForm");

  // Show add form popup
  addBtn.addEventListener("click", () => {
    formPopup.classList.remove("hidden");
  });

  // Close add form popup
  closeBtn.addEventListener("click", () => {
    formPopup.classList.add("hidden");
  });

  // Close edit form popup
  closeEditBtn.addEventListener("click", () => {
    editFormPopup.classList.add("hidden");
  });

  // Show edit form popup and populate fields
  document.querySelectorAll(".editBtn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const jobTitle = e.target.dataset.jobtitle;
      const companyName = e.target.dataset.companyname;
      const description = e.target.dataset.description;
      const date = e.target.dataset.date;

      document.getElementById("editId").value = id;
      document.getElementById("editJobTitle").value = jobTitle;
      document.getElementById("editCompanyName").value = companyName;
      document.getElementById("editDescription").value = description;
      document.getElementById("editDate").value = date;

      editForm.action = `/edit-upcoming/${id}`;
      editFormPopup.classList.remove("hidden");
    });
  });
});
