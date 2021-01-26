// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../../config/middleware/isAuthenticated");
const router = require("express").Router();
const db = require("../../models");

router.get("/", (req, res) => {
  // If the user already has an account send them to the members page
  if (req.user) {
    res.redirect("/members");
  }

  res.sendFile(path.join(__dirname, "../../public/signup.html"));
});

router.get("/login", (req, res) => {
  // If the user already has an account send them to the members page
  if (req.user) {
    res.redirect("/members");
  }

  res.sendFile(path.join(__dirname, "../../public/login.html"));
});

// Route for logging user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Here we've add our isAuthenticated middleware to this route.
// If a user who is not logged in tries to access this route they will be redirected to the signup page
router.get("/members", isAuthenticated, (_req, res) => {
  res.sendFile(path.join(__dirname, "../../public/members.html"));
});

// Trying to use api routes for notes
router.get("/notes", (req, res) =>
  db.Note.findAll()
    .then((notes) => {
      res.render("notes", {
        notes,
      });
    })
    .catch((err) => console.log(err))
);

router.get("/notes/add", (req, res) => res.render("add"));

router.post("/notes/add", (req, res) => {
  let { title, description, contact_email } = req.body;
  let errors = [];

  // Validate fields
  if (!title) {
    errors.push({ text: "Please add a title" });
  }
  if (!description) {
    errors.push({ text: "Please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add a contact email" });
  }

  // Check for errors

  if (errors.length > 0) {
    res.render("add", {
      errors,
      title,
      description,
      contact_email,
    });
  } else {
    db.Note.create({
      title,
      description,
      contact_email,
    })
      .then((note) => res.redirect("/notes"))
      .catch((err) => console.log(err));
  }
});

module.exports = router;
