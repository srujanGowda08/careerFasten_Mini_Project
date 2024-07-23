document
  .getElementById("notifyForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    try {
      const response = await fetch("/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message }),
      });

      if (response.ok) {
        alert("Emails sent successfully!");
        // Close the modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("notifyModal")
        );
        modal.hide();
        // Reset the form
        document.getElementById("notifyForm").reset();
      } else {
        alert("Failed to send emails. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  });
