const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const studentModel = require("./models/studentModel");
const adminModel = require("./models/adminModel");
const feedbackModel = require("./models/feedbackModel");
const upcomingModel = require("./models/upcomingModel");
const ResourceModel = require("./models/resourcesModel");
const { Parser } = require("json2csv");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

//------------------------------------------------------------------------------
// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/");
  }
  try {
    req.user = jwt.verify(token, "your_secret_key");
    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect("/");
  }
};

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.redirect("/");
  }
  next();
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
};

//------------------------------------------------------------------------------
// Routes

// Main route
app.get("/", (req, res) => {
  res.render("login");
});

// Home page
app.get("/home", verifyToken, isStudent, (req, res) => {
  res.render("home", { user: req.user });
});

// Feedback form
app.post("/create", verifyToken, isStudent, async (req, res) => {
  try {
    await feedbackModel.create({
      user: req.user._id,
      userName: req.body.name,
      email: req.body.email,
      content: req.body.message,
    });

    res.redirect("/home");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Admin page
app.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.render("admin", { user: req.user });
});

// Login route
app.post("/login", async (req, res) => {
  const { usn, dateOfBirth } = req.body;
  try {
    let user = await studentModel.findOne({ usn: usn.toLowerCase() });
    if (!user) {
      return res.status(401).send("Invalid USN or date of birth");
    }
    if (user.dateOfBirth !== dateOfBirth) {
      return res.status(401).send("Invalid USN or date of birth");
    }
    const token = jwt.sign(
      { _id: user._id, role: "student", usn: user.usn },
      "your_secret_key",
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/home");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Admin login route
app.post("/admin-login", async (req, res) => {
  const { adminID, password } = req.body;
  try {
    let admin = await adminModel.findOne({ adminID: adminID });
    if (!admin) {
      return res.status(401).send("Invalid Admin ID or Password");
    }
    if (admin.password !== password) {
      return res.status(401).send("Invalid Admin ID or Password");
    }
    const token = jwt.sign(
      { _id: admin._id, role: "admin", adminID: admin.adminID },
      "your_secret_key",
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Roadmap page
app.get("/roadmap", verifyToken, isStudent, (req, res) => {
  res.render("roadmap", { user: req.user });
});

// Upcoming events page
app.get("/upcoming", verifyToken, isStudent, async (req, res) => {
  try {
    const upcoming = await upcomingModel.find();
    res.render("upcoming", { user: req.user, upcoming: upcoming });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Resources page
app.get("/resources", verifyToken, isStudent, async (req, res) => {
  try {
    const resources = await ResourceModel.find();
    res.render("resources", { user: req.user, resources: resources });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// ResumeBuilder page
app.get("/resumebuilder", verifyToken, isStudent, (req, res) => {
  res.render("resumebuilder", { user: req.user });
});

// Discuss page
app.get("/discuss", verifyToken, isStudent, (req, res) => {
  res.render("discuss", { user: req.user });
});

// Admin upcoming page
app.get("/admin-upcoming", verifyToken, isAdmin, async (req, res) => {
  try {
    const upcoming = await upcomingModel.find();
    res.render("admin-upcoming", { user: req.user, upcoming: upcoming });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Create upcoming event
app.post("/create-upcoming", verifyToken, isAdmin, async (req, res) => {
  try {
    await upcomingModel.create({
      jobTitle: req.body.jobTitle,
      companyName: req.body.companyName,
      description: req.body.description,
      date: req.body.date,
    });
    res.redirect("/admin-upcoming");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Edit upcoming event
app.post("/edit-upcoming/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { jobTitle, companyName, description, date } = req.body;
    await upcomingModel.findByIdAndUpdate(id, {
      jobTitle,
      companyName,
      description,
      date,
    });
    res.redirect("/admin-upcoming");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Delete upcoming event
app.post("/delete-upcoming/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await upcomingModel.findByIdAndDelete(id);
    res.redirect("/admin-upcoming");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
// Route to export upcoming updates
app.get("/export-upcoming", verifyToken, isAdmin, async (req, res) => {
  try {
    const upcoming = await upcomingModel.find();

    const fields = [
      { label: "Job Title", value: "jobTitle" },
      { label: "Company Name", value: "companyName" },
      { label: "Description", value: "description" },
      {
        label: "Date",
        value: (row) => new Date(row.date).toLocaleDateString(),
      },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(upcoming);

    res.header("Content-Type", "text/csv");
    res.attachment("upcoming_updates.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting upcoming updates:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Resources page for admin
app.get("/admin-resources", verifyToken, isAdmin, async (req, res) => {
  try {
    const resources = await ResourceModel.find();
    res.render("admin-resources", { user: req.user, resources: resources });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Create resource
app.post("/create-resource", verifyToken, isAdmin, async (req, res) => {
  try {
    await ResourceModel.create({
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
    });
    res.redirect("/admin-resources");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Edit resource
app.post("/edit-resource/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, description, date } = req.body;
    await ResourceModel.findByIdAndUpdate(id, {
      category,
      title,
      description,
      date,
    });
    res.redirect("/admin-resources");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Delete resource
app.post("/delete-resource/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await ResourceModel.findByIdAndDelete(id);
    res.redirect("/admin-resources");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Admin feedback page
app.get("/admin-feedback", verifyToken, isAdmin, async (req, res) => {
  try {
    const feedback = await feedbackModel.find();
    res.render("admin-feedback", { user: req.user, feedback: feedback });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Delete feedback
app.post("/delete-feedback/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await feedbackModel.findByIdAndDelete(id);
    res.redirect("/admin-feedback");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

//------------------------------------------------------------------------------
//  transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", //  email service
  auth: {
    user: "cmn896344@gmail.com", // admin email
    pass: "nyud yobb tkdj ghiz", // created app password
  },
});

// Route to handle sending notifications to all students
app.post("/send-notification", verifyToken, isAdmin, async (req, res) => {
  const { subject, message } = req.body;

  try {
    // Retrieve all student email addresses from the database
    const students = await studentModel.find({}, "email");

    if (students.length === 0) {
      return res.status(404).send("No students found");
    }

    // send emails to all students
    const emailPromises = students.map((student) => {
      if (!student.email) {
        console.error(`Missing email for student with ID ${student._id}`);
        return Promise.reject(
          new Error(`Missing email for student with ID ${student._id}`)
        );
      }

      const mailOptions = {
        from: "cmn896344@gmail.com", // admin email
        to: student.email, // student valid email address
        subject: subject,
        text: message,
      };

      console.log(`Sending email to: ${mailOptions.to}`); // Log the recipient email

      // Send email and return the promise
      return transporter
        .sendMail(mailOptions)
        .then((info) => {
          console.log(`Email sent to ${mailOptions.to}: ${info.response}`);
        })
        .catch((error) => {
          console.error(`Error sending email to ${mailOptions.to}:`, error);
        });
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    res.status(200).send("Notifications sent successfully");
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).send("Internal Server Error");
  }
});

//------------------------------------------------------------------------------
// WebSocket integration for real-time messaging

// WebSocket connection
io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle incoming messages
  socket.on("message", (message) => {
    // console.log("message: " + message.text);
    // Broadcast the message to all connected clients
    io.emit("message", { text: message.text, username: message.username });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//------------------------------------------------------------------------------
// Start the server

// Replace 'app.listen' with 'server.listen' to use http server
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
