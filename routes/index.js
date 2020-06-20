module.exports = function (passport) {
  var express = require("express");
  var parseLogic = require("../logic/parseLogic");
  var testLogic = require("../logic/testLogic");
  var listingLogic = require("../logic/listingLogic");
  var Promise = require("promise");
  var router = express.Router();
  const connectEnsureLogin = require("connect-ensure-login");

  /* GET home page. */
  router.get("/", function (req, res, next) {
    if (req.user) {
      res.render("search");
    } else {
      res.redirect("/login");
    }
  });
  router.get("/login", function (req, res, next) {
    var error = req.flash("error");
    var message = req.flash("message");
    res.render("login", { title: "Express", error: error, message: message });
  });

  router.get("/search", connectEnsureLogin.ensureLoggedIn(), function (
    req,
    res,
    next
  ) {
    res.render("search", { title: "Express" });
  });
  router.post("/parse", function (req, res, next) {
    var keyword = req.body.keyword;
    var refPrice = req.body.refPrice;
    var refPercent = req.body.refPercent;
    let websitesChecked = req.body.websitesChecked;

    var listings = [];
    var promises = [];

    // websites.forEach((site) => {
    //   if (site.group == "usedca") {
    //     var promise = parseLogic.parseUsedCA(site.url, keyword);
    //     promises.push(promise);
    //   } else if (site.group == "kijiji") {
    //     var promise = parseLogic.parseKijiji(site.url, keyword, "alberta");
    //     promises.push(promise);
    //   } else if (site.group == "autotrader") {
    //     var promise = parseLogic.parseAutoTrader(site.url, keyword, "alberta");
    //     promises.push(promise);
    //   }
    // });
    var promise = listingLogic.searchListing(websitesChecked, keyword);
    console.log(promise);
    promises.push(promise);

    Promise.all(promises).then((values) => {
      values.forEach((listing) => {
        listings = listings.concat(listing);
      });

      if (refPercent != 0 || refPrice != 0) {
        var maxPrice = refPrice - refPrice * (refPercent / 100);

        listings = listings.filter(function (el) {
          return el.price <= maxPrice;
        });
      }
      res.render("result.ejs", { data: listings });
    });
  });
  return router;
};
