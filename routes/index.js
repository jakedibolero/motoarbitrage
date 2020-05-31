var express = require("express");
var parseLogic = require("../logic/parse");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/parse", function (req, res, next) {
  parseLogic.parse();
});

module.exports = router;
