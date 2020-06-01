const puppeteer = require("puppeteer");
const Listing = require("../models/listing.model");

module.exports = {
  async parseUsedCA(websiteUrl) {
    // const websiteUrl = webUrl;
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
    console.log("Loading Page");
    await page.goto(websiteUrl);
    console.log("Typing Query");
    await page.type("#demo", "2019 Harley Davidson");
    console.log("Submitting");
    await page.click("#submit", { waitUntil: "domcontentloaded" });

    var continueNavigating = true;
    var listings = [];

    while (continueNavigating) {
      await page.waitForSelector("#recent");
      console.log(websiteUrl);
      const result = await page.$$eval(
        "div.article",
        (anchors, websiteUrl) => {
          return anchors.map((anchor) => {
            let listingText = anchor
              .querySelector("p.title")
              .textContent.trim();
            let seller = anchor.querySelector("p.username").textContent.trim();
            let listingPath = anchor
              .querySelector("p.title > a")
              .getAttribute("href");
            let listingDescription = anchor
              .querySelector("p.description")
              .textContent.trim();
            let imgUrl = anchor
              .querySelector("div.img-border > a > img")
              .getAttribute("src");
            let price = listingText.split("·")[0].replace(/[$,]/g, "").trim();
            let listingName = listingText.split("·")[1].trim();

            let url = websiteUrl + listingPath;
            let listing = {
              price,
              listingName,
              listingDescription,
              url,
              imgUrl,
            };
            return listing;
          });
        },
        websiteUrl
      );
      listings = listings.concat(result);
      if ((await page.$("span.next")) !== null) {
        console.log("HERE");
        await page.click(
          "#classified > div.header.rborder-full > span.next > a"
        );
      } else {
        continueNavigating = false;
      }
    }

    return listings;
  },
};
