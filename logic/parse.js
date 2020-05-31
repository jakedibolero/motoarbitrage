const puppeteer = require("puppeteer");

module.exports = {
  async parse() {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    console.log("Loading Page");
    await page.goto("https://www.usedokanagan.com/");
    console.log("Typing Query");

    await page.type("#demo", "Harley Davidson");
    console.log("Submitting");
    await page.click("#submit", { waitUntil: "domcontentloaded" });

    var continueNavigating = true;
    var listings = [];

    while (continueNavigating) {
      await page.waitForSelector("#recent");
      console.log("FOUND LISTINGS");
      const result = await page.$$eval("div.article", (anchors) => {
        return anchors.map((anchor) =>
          anchor.querySelector("p.title").textContent.trim()
        );
      });
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

    console.log(listings);
  },
};
