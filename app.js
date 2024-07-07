const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const studentModel = require("./models/studentModel");
const adminModel = require("./models/adminModel");
const feedbackModel = require("./models/feedbackModel");

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

//-------------------------------------------------------------------

// main route
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
app.get("/upcoming", verifyToken, isStudent, (req, res) => {
  res.render("upcoming", { user: req.user });
});

// Resources page
app.get("/resources", verifyToken, isStudent, (req, res) => {
  res.render("resources", { user: req.user });
});

// ResumeBuilder page
app.get("/resumebuilder", verifyToken, isStudent, (req, res) => {
  res.render("resumebuilder", { user: req.user });
});

// Discuss page
app.get("/discuss", verifyToken, isStudent, (req, res) => {
  res.render("discuss", { user: req.user });
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Server running
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
