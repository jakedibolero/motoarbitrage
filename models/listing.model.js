const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  price: Number,
  listingName: { type: String, text: true },
  listingDescription: String,
  url: String,
  imgUrl: String,
  group: String,
});

module.exports = mongoose.model("Listing", listingSchema);
