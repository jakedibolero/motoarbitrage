var User = require("../models/user.model");
var Webgroup = require("../models/webgroup.model");
var Payment = require("../models/payment.model");
const { update } = require("../models/webgroup.model");

module.exports = {
  async updateUser(user) {
    let updateUser = await User.findById(user.userID).exec();
    let webgroups = await Webgroup.find().exec();
    if (updateUser == null) return null;
    updateUser.firstName = user.firstName;

    updateUser.lastName = user.lastName;

    updateUser.status = user.status == null ? 0 : 1;

    if (user.allowedWebgroups != null) {
      updateUser.allowedWebgroups = webgroups.filter((webgroup) => {
        return user.allowedWebgroups.some((x) => x == webgroup.group);
      });
    } else {
      updateUser.allowedWebgroups = [];
    }

    if (user.email != null) {
      updateUser.email = user.email;
    }
    if (user.password != "") {
      updateUser.password = updateUser.generateHash(user.password);
    }
    updateUser.save();
    return updateUser;
  },
  async addPayment(email, paymentAmount, adminID) {
    let user = await User.findOne({ email: email }).exec();
    if (user == null) return null;
    let payment = Object.assign(new Payment());
    payment.paymentAmount = paymentAmount;
    payment.paymentDate = new Date().getTime();
    payment.user = user._id;
    payment.admin = adminID;
    await payment.save();
    await user.payments.push(payment._id);
    user.save();
    return payment;
  },
  async getPayment(paymentID) {
    let payment = await Payment.findById(paymentID)
      .populate("user")
      .populate("admin")
      .exec();
    if (payment == null) return null;
    return payment;
  },
  async updatePayment(paymentUpdate) {
    let payment = await Payment.findById(paymentUpdate._id).exec();
    if (payment == null) return null;
    payment.paymentAmount = paymentUpdate.amount;
    await payment.save();
    return payment;
  },
};
