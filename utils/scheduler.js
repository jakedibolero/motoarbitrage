var cron = require("node-cron");
var testLogic = require("../logic/testLogic");
var websites = [
  //   { url: "https://www.usedvancouver.com", group: "usedca" },
  //   { url: "https://www.usedkamloops.com", group: "usedca" },
  //   { url: "https://www.usedkelowna.com", group: "usedca" },
  //   { url: "https://www.usedvernon.com", group: "usedca" },
  //   { url: "https://www.usedcalgary.com", group: "usedca" },
  { url: "https://www.kijiji.ca", group: "kijiji" },
  {
    url:
      "https://www.autotrader.ca/motorcycles-atvs/all/on/?rcp=100&prv=Ontario&loc=K1Y%202B8",
    group: "autotrader",
  },
];
var provinces = [{ name: "alberta", id: 9003 }];
var makes = ["harley davidson"];
console.log("Starting Scheduled Scrape");
cron.schedule("*/10 * * * *", () => {
  console.log("Starting Scheduled Scrape");
  var result = testLogic.testParse(websites, provinces, makes);
  result.then((data) => {
    console.log("DONE JOB");
    console.log(data.length);
  });
});
