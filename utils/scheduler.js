var CronJob = require("cron").CronJob;
var listingLogic = require("../logic/listingLogic");
var testLogic = require("../logic/testLogic");
var websites = [
  // { url: "https://www.usedvancouver.com", group: "usedca" },
  // { url: "https://www.usedkamloops.com", group: "usedca" },
  // { url: "https://www.usedkelowna.com", group: "usedca" },
  // { url: "https://www.usedvernon.com", group: "usedca" },
  // { url: "https://www.usedcalgary.com", group: "usedca" },
  { url: "https://www.kijiji.ca", group: "kijiji" },
  // {
  //   url:
  //     "https://www.autotrader.ca/motorcycles-atvs/all/on/?rcp=100&prv=Ontario&loc=K1Y%202B8",
  //   group: "autotrader",
  // },
];
var provinces = [
  { name: "alberta", id: 9003 },
  { name: "british-columbia", id: 9007 },
];
var makes = ["harley davidson"];
var doneWithPreviousJob = true;

const job = new CronJob("0 */4 * * *", () => runScrape());
job.start();

function runScrape() {
  if (doneWithPreviousJob) {
    console.log("Starting Scheduled Scrape");
    doneWithPreviousJob = false;
    var result = testLogic.testParse(websites, provinces, makes);
    result.then((data) => {
      if (data.length != 0) {
        listingLogic.updateListingDatabase(data).then((res) => {
          console.log(`Inserted ${res} listings`);
          console.log("Done with job");
          doneWithPreviousJob = true;
        });
      }
    });
  }
}
module.exports = {
  runScrape,
};
