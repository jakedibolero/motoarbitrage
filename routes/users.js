module.exports = function (passport) {
  var express = require("express");
  var router = express.Router();
  var userLogic = require("../logic/userLogic");

  /* GET users listing. */
  router.get("/", function (req, res, next) {
    res.send("respond with a resource");
  });
  router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  // router.post("/register", (req, res, next) => {
  //   userLogic.register(req.body).then((message) => {
  //     res.render("login", { message: message });
  //   });
  // });
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
