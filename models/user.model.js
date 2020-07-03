const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var listing = require("./listing.model").schema;
var webgroup = require("./webgroup.model").schema;
const passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  dateCreated: Date,
  status: Number,
  role: String,
  savedListings: [listing],
  allowedWebgroups: [webgroup],
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checks if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.saveListing = function (listing) {
  this.savedListings.push(listing);
};
userSchema.methods.activeUser = function (user) {
  return user.status == 1 ? true : false;
};

module.exports = mongoose.model("User", userSchema);

//status codes
//0-requested,1-active,2-disabled,3-disabled/nopayment
