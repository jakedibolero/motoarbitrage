module.exports = function (passport) {
  var express = require("express");
  var router = express.Router();
  var adminLogic = require("../logic/adminLogic");
  const userLogic = require("../logic/userLogic");
  const connectEnsureLogin = require("connect-ensure-login");

  router.get("/dashboard", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    var promise = userLogic.getAllUsers();
    promise.then((users) => {
      console.log(users);
      res.render("admin/dashboard.ejs", { user: req.user, users: users });
    });
  });

  return router;
};
