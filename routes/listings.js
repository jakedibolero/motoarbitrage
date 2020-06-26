module.exports = function () {
  var express = require("express");
  var router = express.Router();
  var listingLogic = require("../logic/listingLogic");
  router.post("/saveListing", function (req, res, next) {
    var promise = listingLogic.saveListing(req.user._id, req.body.listingID);
    promise.then((result) => {
      res.json(result);
    });
  });

  return router;
};
