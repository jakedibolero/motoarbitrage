const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  price: Number,
  listingName: String,
  listingDescription: String,
});

module.exports = mongoose.model("Listing", listingSchema);
