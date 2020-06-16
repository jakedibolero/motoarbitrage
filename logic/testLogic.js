const puppeteer = require("puppeteer-extra");
const select = require("puppeteer-select");
const Listing = require("../models/listing.model");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const e = require("express");

puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer.use(StealthPlugin());

module.exports = {
  async testParse(count) {
    console.log(`start test ${count}`);
    const browser = await puppeteer.launch({
      devtools: false,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--ignore-certificate-errors",
      ],
    });
  },
};
