module.exports = function (passport) {
  var express = require("express");
  var router = express.Router();
  var adminLogic = require("../logic/adminLogic");
  const userLogic = require("../logic/userLogic");
  const helper = require("../utils/helper");
  const connectEnsureLogin = require("connect-ensure-login");

  router.get("/dashboard", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    var promise = userLogic.getAllUsers();
    promise.then((users) => {
      res.render("admin/dashboard.ejs", { user: req.user, users: users });
    });
  });
  router.get("/manageUser", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    var userID = req.query.userID;
    var error = req.flash("error");
    var message = req.flash("message");
    var promise = userLogic.getUser(userID);
    promise.then((user) => {
      helper.getWebgroups().then((webgroups) => {
        res.render("admin/manageUser.ejs", {
          manageUser: user,
          user: req.user,
          error: error,
          message: message,
          webgroups: webgroups,
        });
      });
    });
  });

  router.post("/updateUser", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    let promise = adminLogic.updateUser(req.body);
    promise.then((user) => {
      if (user == null) {
        req.flash("error", "User not found?");
      } else {
        req.flash("message", "Succesfully updated user profile.");
      }
      res.redirect(`manageUser?userID=${user._id}`);
    });
  });

  return router;
};
