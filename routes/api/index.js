const router = require("express").Router();
// Requiring our models and passport as we've configured it
const db = require("../../models");
const passport = require("../../config/passport");

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/login", passport.authenticate("local"), (req, res) => {
  // Sending back a password, even a hashed password, isn't a good idea
  res.json({
    email: req.user.email,
    id: req.user.id,
  });
});

// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/signup", (req, res) => {
  db.User.create(req.body)
    .then(() => {
      res.redirect(307, "/api/login");
    })
    .catch((err) => {
      res.status(401).json(err);
    });
});

// Route for getting some data about our user to be used client side
router.get("/user_data", (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    return res.json({});
  }
  // Otherwise send back the user's email and id
  // Sending back a password, even a hashed password, isn't a good idea
  const { password, ...user } = req.user;
  res.json(user);
});

// Trying to add the api routes for notes
// router.post("/notes/add", (req, res) => {
//   let { title, description, contact_email } = req.body;
//   let errors = [];

//   // Validate fields
//   if (!title) {
//     errors.push({ text: "Please add a title" });
//   }
//   if (!description) {
//     errors.push({ text: "Please add a description" });
//   }
//   if (!contact_email) {
//     errors.push({ text: "Please add a contact email" });
//   }

//   // Check for errors

//   if (errors.length > 0) {
//     res.render("add", {
//       errors,
//       title,
//       description,
//       contact_email,
//     });
//   } else {
//     db.Note.create({
//       title,
//       description,
//       contact_email,
//     })
//       .then((note) => res.json(note))
//       .catch((err) => console.log(err));
//   }
// });

// router.get("/notes", (req, res) =>
//   db.Note.findAll()
//     .then((notes) => {
//       res.json(notes);
//     })
//     .catch((err) => console.log(err))
// );
module.exports = router;
