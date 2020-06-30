const Webgroup = require("../models/webgroup.model");

module.exports = {
  async getWebgroups() {
    var webgroups = Webgroup.find().exec();
    return webgroups;
  },
};
