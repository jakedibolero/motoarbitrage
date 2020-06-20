var Listing = require("../models/listing.model");

module.exports = {
  async updateListingDatabase(listings) {
    console.log("Deleting old listings");
    await Listing.deleteMany({}).exec();
    console.log("Uploading new listings");
    await Listing.insertMany(listings);
    console.log("Done Upload");
    return listings.length;
  },
  async searchListing(websitesChecked, keywords) {
    console.log(websitesChecked);
    let result = [];
    let mongoFormatKeyword = keywords
      .split(" ")
      .map((str) => `"${str}"`)
      .join(" ");
    console.log(mongoFormatKeyword);
    result = await Listing.find({ $text: { $search: mongoFormatKeyword } });
    console.log(result.length);
    finalResult = result.filter((el) => {
      return websitesChecked.includes(el.group);
    });
    console.log(finalResult.length);
    return finalResult;
  },
};
