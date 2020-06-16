const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
  websiteUrl: String,
  group: String,
  uniqueCode: String,
});

module.exports = mongoose.model("Website", websiteSchema);
