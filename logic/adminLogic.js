var User = require("../models/user.model");
var Webgroup = require("../models/webgroup.model");
const { update } = require("../models/webgroup.model");

module.exports = {
  async updateUser(user) {
    let updateUser = await User.findById(user.userID).exec();
    let webgroups = await Webgroup.find().exec();
    if (updateUser == null) return null;
    updateUser.firstName = user.firstName;

    updateUser.lastName = user.lastName;

    updateUser.status = user.status == null ? 0 : 1;

    console.log(user);

    updateUser.allowedWebgroups = webgroups.filter((webgroup) => {
      return user.allowedWebgroups.some((x) => x == webgroup.group);
    });

    console.log();

    if (user.email != null) {
      updateUser.email = user.email;
    }
    if (user.password != "") {
      updateUser.password = updateUser.generateHash(user.password);
    }
    updateUser.save();
    return updateUser;
  },
};
