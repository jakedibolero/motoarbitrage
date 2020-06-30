var Listing = require("../models/listing.model");
var User = require("../models/user.model");

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
    let result = [];
    //Split the keyword into mongo's prescribed format for AND text searches.
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
  async saveListing(userID, listingID) {
    try {
      var user = await User.findById(userID).exec();
      var msg = { type: "", msg: "" };
      if (user == null) {
        msg.type = "error";
        msg.msg =
          "User can't be found or user session has expired. Please log in.";
        return msg;
      }
      var listing = await Listing.findById(listingID).exec();
      if (listing == null) {
        msg.type = "error";
        msg.msg = "This listing doesn't exist anymore. Listing removed.";
        user.savedListings = user.savedListings.filter(
          (x) => x._id != listingID
        );
        user.save();
        return msg;
      }
      if (user.savedListings.find((x) => x._id == listingID) != null) {
        msg.type = "remove";
        msg.msg = "Listing unsaved.";
        user.savedListings = user.savedListings.filter(
          (x) => x._id != listingID
        );
      } else {
        user.savedListings.push(listing);
        msg.type = "insert";
        msg.msg = "Successfully saved the listing!";
      }
      user.save();
      return msg;
    } catch (e) {
      msg.type = "error";
      msg.msg = "Something went wrong while saving. Please try again.";
      return msg;
    }
  },
};
