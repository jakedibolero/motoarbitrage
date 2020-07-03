const Webgroup = require("../models/webgroup.model");

module.exports = {
  async getWebgroups() {
    var webgroups = Webgroup.find().exec();
    return webgroups;
  },
  isAdmin(user) {
    return user.role == "admin" ? true : false;
  },
};
