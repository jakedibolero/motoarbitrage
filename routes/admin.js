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
    if (!helper.isAdmin(req.user)) {
      res.redirect("/index");
    } else {
      var promise = userLogic.getAllUsers();
      promise.then((users) => {
        res.render("admin/dashboard.ejs", { user: req.user, users: users });
      });
    }
  });
  router.get("/manageUser", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    if (!helper.isAdmin(req.user)) {
      res.redirect("/index");
    } else {
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
    }
  });

  router.post("/updateUser", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    if (!helper.isAdmin(req.user)) {
      res.redirect("/index");
    } else {
      let promise = adminLogic.updateUser(req.body);
      promise.then((user) => {
        if (user == null) {
          req.flash("error", "User not found?");
        } else {
          req.flash("message", "Succesfully updated user profile.");
        }
        res.redirect(`manageUser?userID=${user._id}`);
      });
    }
  });

  router.get("/payment", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    if (!helper.isAdmin(req.user)) {
      res.redirect("/index");
    } else {
      var error = req.flash("error");
      var message = req.flash("message");
      var promise = userLogic.getUser(req.query.userID);
      promise.then((user) => {
        res.render("admin/payment.ejs", {
          error: error,
          message: message,
          user: req.user,
          manageUser: user,
        });
      });
    }
  });

  router.post("/addPayment", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    if (!helper.isAdmin(req.user)) {
      res.redirect("/index");
    } else {
      var error = req.flash("error");
      var message = req.flash("message");
      var promise = adminLogic.addPayment(
        req.body.email,
        req.body.amount,
        req.user._id
      );
      promise.then((result) => {
        if (result == null) {
          req.flash("error", "Something went wrong. Please try again.");
        } else {
          req.flash("message", "Payment has been added!");
        }
        res.redirect(`manageUser?userID=${result.user}`);
      });
    }
  });
  router.get("/managePayment", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    if (!helper.isAdmin(req.user)) {
      res.redirect("/index");
    } else {
      var error = req.flash("error");
      var message = req.flash("message");
      var promise = adminLogic.getPayment(req.query.paymentID);
      promise.then((payment) => {
        res.render("admin/managePayment.ejs", {
          error: error,
          message: message,
          payment: payment,
          user: req.user,
        });
      });
    }
  });
  router.post("/updatePayment", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    if (!helper.isAdmin(req.user)) {
      res.redirect("/index");
    } else {
      var error = req.flash("error");
      var message = req.flash("message");
      var promise = adminLogic.updatePayment(req.body);
      promise.then((payment) => {
        if (payment == null) {
          req.flash("error", "Payment not found?");
        } else {
          req.flash("message", "Succesfully updated payment information.");
        }
        res.redirect(`manageUser?userID=${payment.user}`);
      });
    }
  });

  return router;
};
