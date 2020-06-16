module.exports = function (passport) {
  var express = require("express");
  var parseLogic = require("../logic/parseLogic");
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
    console.log(error);
    console.log(message);
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

    console.log(req.body.websitesChecked);

    var websites = [
      { url: "https://www.usedvancouver.com", group: "usedca" },
      { url: "https://www.usedkamloops.com", group: "usedca" },
      { url: "https://www.usedkelowna.com", group: "usedca" },
      { url: "https://www.usedvernon.com", group: "usedca" },
      { url: "https://www.usedcalgary.com", group: "usedca" },
      { url: "https://www.kijiji.ca", group: "kijiji" },
      {
        url:
          "https://www.autotrader.ca/motorcycles-atvs/all/on/?prv=Ontario&loc=K1Y%202B8",
        group: "autotrader",
      },
    ];
    websites = websites.filter((el) => {
      return websitesChecked.includes(el.group);
    });
    console.log(websites);
    var listings = [];
    var promises = [];

    websites.forEach((site) => {
      if (site.group == "usedca") {
        var promise = parseLogic.parseUsedCA(site.url, keyword);
        promises.push(promise);
      } else if (site.group == "kijiji") {
        var promise = parseLogic.parseKijiji(site.url, keyword, "alberta");
        promises.push(promise);
      } else if (site.group == "autotrader") {
        var promise = parseLogic.parseAutoTrader(site.url, keyword, "alberta");
        promises.push(promise);
      }
    });

    Promise.all(promises).then((values) => {
      values.forEach((listing) => {
        listings = listings.concat(listing);
      });

      if (refPercent != 0 || refPrice != 0) {
        var maxPrice = refPrice - refPrice * (refPercent / 100);

        listings = listings.filter(function (el) {
          console.log(refPrice);
          console.log(maxPrice);
          return el.price <= maxPrice;
        });
      }
      res.render("result.ejs", { data: listings });
    });
  });
  return router;
};
