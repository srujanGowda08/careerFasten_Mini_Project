function toggleModal() {
  document.getElementById("emailModal").classList.toggle("hidden");
}

async function sendNotification() {
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  const response = await fetch("/notify-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subject, message }),
  });

  if (response.ok) {
    alert("Notification sent successfully");
    toggleModal();
  } else {
    alert("Failed to send notification");
  }
}
