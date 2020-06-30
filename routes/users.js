module.exports = function (passport) {
  var express = require("express");
  var router = express.Router();
  var userLogic = require("../logic/userLogic");
  const connectEnsureLogin = require("connect-ensure-login");

  /* GET users listing. */
  router.get("/", function (req, res, next) {
    res.send("respond with a resource");
  });
  router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  router.get("/settings", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    var error = req.flash("error");
    var message = req.flash("message");
    res.render("settings.ejs", {
      user: req.user,
      error: error,
      message: message,
    });
  });
  router.get("/favorites", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res
  ) {
    res.render("favorites.ejs", {
      data: req.user.savedListings,
      savedListings: req.user.savedListings,
      user: req.user,
    });
  });
  router.post("/updateProfile", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res
  ) {
    var promise = userLogic.updateProfile(req.body, req.user._id);
    promise.then((user) => {
      if (user == null) {
        req.flash("error", "User not found?");
      } else {
        // req.user.firstName = result.firstName;
        // req.user.lastName = result.lastName;
        // req.user.email = result.email;
        req.flash("message", "Succesfully updated your profile.");
      }

      res.redirect("settings");
    });
  });
  router.post(
    "/register",
    passport.authenticate("local-signup", {
      successRedirect: "/login", //redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );
  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/search", //redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  return router;
};
