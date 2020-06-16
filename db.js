var mongoose = require("mongoose");
var url =
  "mongodb+srv://test:testuser@motoarbitrage-o91ak.azure.mongodb.net/MotoArbitrate-Test?retryWrites=true&w=majority";

// var url = "mongodb://jake:jakeisgwapo123@ds056688.mlab.com:56688/owon-test"; /// TEST
mongoose.connect(url);
const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
  module.exports = db;
});
db.on("error", (err) => {
  console.error("connection error:", err);
});
