const { addExtra } = require("puppeteer-extra");
const vanillaPuppeteer = require("puppeteer");
const kijiji = require("kijiji-scraper");

const Listing = require("../models/listing.model");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
require("events").EventEmitter.defaultMaxListeners = 0;

const puppeteer = addExtra(vanillaPuppeteer);

puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer.use(StealthPlugin());
const { Cluster } = require("puppeteer-cluster");

module.exports = {
  async testParse(websites, provinces, makes) {
    try {
      let completeList = [];
      const cluster = await Cluster.launch({
        puppeteer,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 1,
        timeout: 500000,
        puppeteerOptions: {
          devtools: false,
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--ignore-certificate-errors",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--no-zygote",
          ],
        },
      });
      cluster.on("taskerror", (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`);
      });

      await cluster.task(async ({ page, data: task }) => {
        await page.setDefaultNavigationTimeout(60000);
        if (task.site.group == "usedca") {
          let listing = await this.parseUsedCA(page, task.site.url, task.make);

          completeList = completeList.concat(listing);
        } else if (task.site.group == "kijiji") {
          let listing = await this.parseKijiji(
            page,
            task.site.url,
            task.make,
            task.province
          );

          completeList = completeList.concat(listing);
        } else if (task.site.group == "autotrader") {
          let listing = await this.parseAutoTrader(
            page,
            task.site.url,
            task.make,
            task.province
          );

          completeList = completeList.concat(listing);
        }
      });

      websites.forEach((site) => {
        var task = {};
        task.site = site;
        task.provinces = provinces;
        task.makes = makes;

        if (site.group == "usedca") {
          makes.forEach((make) => {
            cluster.queue({ site, make });
          });
        } else if (site.group == "kijiji") {
          provinces.forEach((province) => {
            makes.forEach((make) => {
              cluster.queue({ site, make, province });
            });
          });
        } else if (site.group == "autotrader") {
          provinces.forEach((province) => {
            makes.forEach((make) => {
              cluster.queue({ site, make, province });
            });
          });
        }
      });
      await cluster.idle();
      await cluster.close();
      return completeList;
    } catch (err) {
      console.log(err);
      return completeList;
    }
  },
  async parseUsedCA(page, websiteUrl, keyword) {
    try {
      console.log(websiteUrl);
      await page.goto(websiteUrl, { waitUntil: "networkidle0" });
      await page.type("#demo", keyword);
      await page.click("#submit", { waitUntil: "domcontentloaded" });

      let continueNavigating = true;
      let listings = [];
      let cleanList = [];

      while (continueNavigating) {
        await page.waitForSelector("#recent");
        const result = await page.$$eval(
          "div.article",
          (anchors, websiteUrl) => {
            return anchors.map((anchor) => {
              let listingText = anchor
                .querySelector("p.title")
                .textContent.trim();
              if (listingText.charAt(0) !== "$") {
                return null;
              }
              let seller = anchor
                .querySelector("p.username")
                .textContent.trim();
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
          await page.click(
            "#classified > div.header.rborder-full > span.next > a"
          );
        } else {
          continueNavigating = false;
        }
      }
      cleanList = listings.filter(function (el) {
        return el != null;
      });
      console.log(`End Parse${websiteUrl}`);
      return cleanList;
    } catch (err) {
      console.log(err);
      return cleanList;
    }
  },
  async parseKijiji(page, websiteUrl, keyword, province) {
    try {
      console.log("Kijiji parse");
      let options = {
        minResults: 5000,
      };
      let params = {
        locationId: province.id, // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
        categoryId: 30, // Same as kijiji.categories.CARS_AND_VEHICLES
        keywords: keyword,
      };
      let kijijiRes = await kijiji.search(params, options);
      let listings = [];
      let cleanList = [];
      kijijiRes.forEach((ad) => {
        let price = ad.attributes.price;
        let listingName = ad.title;
        let listingDescription = ad.description;
        let url = ad.url;
        let imgUrl = ad.image;
        let listing = {
          price,
          listingName,
          listingDescription,
          url,
          imgUrl,
        };
        listings.push(listing);
      });
      cleanList = listings.filter(function (el) {
        return el.price != 0;
      });
      console.log("End parse");
      return cleanList;
    } catch (err) {
      console.log(err);
      return cleanList;
    }
  },
  async parseAutoTrader(page, websiteUrl, keyword, province) {
    try {
      console.log("Parsing Autotrader");
      await page.goto(websiteUrl, { waitUntil: "networkidle0" });
      await page.click("body");
      const locationElement = await page.waitForSelector("#locationAddress", {
        visible: true,
      });

      await page.focus("#locationAddress");
      const inputValue = await page.$eval("#locationAddress", (el) => el.value);
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press("Backspace");
      }
      await locationElement.type(province.name);

      await page.waitFor(2000);
      const keywordElement = await page.waitForSelector(
        "#txtKeywords:not(.disabled)"
      );
      await page.focus("#txtKeywords");
      await keywordElement.type(keyword);

      const searchIconElement = await page.waitForSelector("#keywordSearch");
      await page.focus("#keywordSearch");
      await page.keyboard.press("Enter");
      await page.waitForNavigation();
      let continueNavigating = true;
      let isLast = false;
      let cleanList = [];
      let listings = [];
      let counter = 2;

      noResultElement = await page.$("#searchExpansionWarning.hidden");
      if (noResultElement === null) {
        await browser.close();
        return [];
      }
      while (continueNavigating) {
        await page.waitForSelector("div.result-item:not(.blank-item)");

        let result = await page.$$eval(
          "div.result-item-inner.organic",
          (anchors, websiteUrl) => {
            return anchors.map((anchor) => {
              let tempPrice = anchor.querySelector(
                "div.detail-price-area > div.fixed-price-column > div.price-wrapper > div.price-delta > div.price > span.price-amount"
              );
              if (
                tempPrice == null ||
                tempPrice.textContent.charAt(0) !== "$"
              ) {
                return null;
              }

              let price = tempPrice.textContent.trim().replace(/[$,]/g, "");
              let listingName = anchor
                .querySelector(
                  "div.detail-center-area > div > div > h2 > a > span"
                )
                .textContent.trim();
              let listingDescription = anchor
                .querySelector(" div.detail-center-area > div > div > p")
                .textContent.trim();

              let listingPath = document
                .querySelector(
                  "div.col-xs-6.detail-center-area > div > div > h2 > a"
                )
                .getAttribute("href");

              let url = "https://www.autotrader.ca" + listingPath;

              let imgUrl =
                anchor
                  .querySelector("div.fixed-photo-column > div > a > img")
                  .getAttribute("data-original") == null
                  ? document
                      .querySelector("div.fixed-photo-column > div > a > img")
                      .getAttribute("src")
                  : document
                      .querySelector("div.fixed-photo-column > div > a > img")
                      .getAttribute("data-original");

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
        if ((await page.$("a.next-more-link")) !== null) {
          await page.waitForSelector(`a[class="page-link-${counter}`);
          await page.click(`a[class="page-link-${counter}"]`, {
            waitUntil: "networkidle0",
          });
        } else if (!isLast) {
          isLast = true;

          var withPagination = await page.$eval(
            "div.pager-wrapper > div.pager-container > div.srpPager",
            (el) => {
              var style = el.getAttribute("style");
              if (style != null) {
                return style.includes("block");
              } else {
                return true;
              }
            }
          );
          if (withPagination) {
            await page.click(`a[class="page-link-${counter}"]`, {
              waitUntil: "networkidle0",
            });
          } else {
            continueNavigating = false;
          }
        } else {
          continueNavigating = false;
        }
        listings = listings.concat(result);
        counter++;
      }

      console.log(`End Parse${websiteUrl}`);
      cleanList = listings.filter(function (el) {
        return el != null;
      });
      return cleanList;
    } catch (err) {
      console.log(err);
      return cleanList;
    }
  },
};
