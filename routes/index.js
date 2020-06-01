var express = require("express");
var parseLogic = require("../logic/parse");
var Promise = require("promise");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("landing-page", { title: "Express" });
});
router.get("/index", function (req, res, next) {
  res.render("result", { title: "Express" });
});
router.get("/search", function (req, res, next) {
  res.render("search", { title: "Express" });
});
router.get("/parse", function (req, res, next) {
  var websites = [
    "https://www.usedvancouver.com",
    // "https://www.usedkamloops.com",
    // "https://www.usedkelowna.com",
    // "https://www.usedvernon.com",
    // "https://www.usedcalgary.com",
  ];
  var listings = [];
  var promises = [];
  websites.forEach((object) => {
    var promise = parseLogic.parseUsedCA(object);
    promises.push(promise);
  });
  Promise.all(promises).then((values) => {
    values.forEach((listing) => {
      listings = listings.concat(listing);
      res.render("result.ejs", { data: listings });
    });
  });
});

module.exports = router;
