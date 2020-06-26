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
  router.post(
    "/register",
    passport.authenticate("local-signup", {
      successRedirect: "/search", //redirect to the secure profile section
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
