const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  paymentAmount: Number,
  paymentDate: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
