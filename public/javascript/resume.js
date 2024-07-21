function generateResume() {
  const { jsPDF } = window.jspdf;

  // Getting the form values
  const name = document.getElementById("name").value;
  const degree = document.getElementById("degree").value;
  const objective = document.getElementById("objective").value;
  const technicalSkills = document.getElementById("technicalSkills").value;
  const personalSkills = document.getElementById("personalSkills").value;
  const address = document.getElementById("address").value;
  const contact = document.getElementById("contact").value;
  const email = document.getElementById("email").value;
  const dob = document.getElementById("dob").value;
  const education = document.getElementById("education").value;
  const achievements = document.getElementById("achievements").value;
  const experience = document.getElementById("experience").value;

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Adding content to the PDF
  const leftMargin = 20;
  const rightMargin = 140;
  const lineHeight = 10;
  let currentY = 20;

  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(name, leftMargin, currentY);
  currentY += lineHeight;

  doc.setFontSize(16);
  doc.setTextColor(0, 150, 150);
  doc.text(degree, leftMargin, currentY);
  currentY += lineHeight + 5;

  doc.setDrawColor(0, 150, 150);
  doc.line(leftMargin, currentY, 190, currentY); // horizontal line
  currentY += lineHeight;

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("CAREER OBJECTIVE", leftMargin, currentY);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(objective, leftMargin, currentY + 5, { maxWidth: 170 });
  currentY += lineHeight * 3;

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("TECHNICAL SKILLS", leftMargin, currentY);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(technicalSkills, leftMargin, currentY + 5, { maxWidth: 170 });
  currentY += lineHeight * 3;

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("PERSONAL SKILLS", leftMargin, currentY);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(personalSkills, leftMargin, currentY + 5, { maxWidth: 170 });
  currentY += lineHeight * 3;

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("ADDRESS", rightMargin, 45);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(address, rightMargin, 50, { maxWidth: 50 });

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("CONTACT", rightMargin, 70);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(contact, rightMargin, 75);

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("E-MAIL", rightMargin, 85);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(email, rightMargin, 90);

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("DATE OF BIRTH", rightMargin, 105);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(dob, rightMargin, 110);

  currentY += 15; // Move down to make space for right column content

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("EDUCATION", leftMargin, currentY);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(education, leftMargin, currentY + 5, { maxWidth: 170 });
  currentY += lineHeight * 3;

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("ACHIEVEMENTS/RESPONSIBILITIES", leftMargin, currentY);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(achievements, leftMargin, currentY + 5, { maxWidth: 170 });
  currentY += lineHeight * 3;

  doc.setFontSize(14);
  doc.setTextColor(0, 150, 150);
  doc.text("PRE-PROFESSIONAL EXPERIENCE", leftMargin, currentY);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(experience, leftMargin, currentY + 5, { maxWidth: 170 });
  currentY += lineHeight * 3;

  // Save the PDF
  doc.save(`${name}_Resume.pdf`);
}

function updatePreview() {
  document.getElementById("previewName").innerText =
    document.getElementById("name").value;
  document.getElementById("previewDegree").innerText =
    document.getElementById("degree").value;
  document.getElementById("previewObjective").innerText =
    document.getElementById("objective").value;
  document.getElementById("previewTechnicalSkills").innerText =
    document.getElementById("technicalSkills").value;
  document.getElementById("previewPersonalSkills").innerText =
    document.getElementById("personalSkills").value;
  document.getElementById("previewAddress").innerText =
    document.getElementById("address").value;
  document.getElementById("previewContact").innerText =
    document.getElementById("contact").value;
  document.getElementById("previewEmail").innerText =
    document.getElementById("email").value;
  document.getElementById("previewDob").innerText =
    document.getElementById("dob").value;
  document.getElementById("previewEducation").innerText =
    document.getElementById("education").value;
  document.getElementById("previewAchievements").innerText =
    document.getElementById("achievements").value;
  document.getElementById("previewExperience").innerText =
    document.getElementById("experience").value;
}
