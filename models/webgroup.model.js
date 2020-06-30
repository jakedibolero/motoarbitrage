const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webgroupSchema = new Schema({
  group: String,
});

module.exports = mongoose.model("Webgroup", webgroupSchema);
