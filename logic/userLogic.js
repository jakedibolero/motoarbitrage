var User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { update } = require("../models/user.model");

module.exports = {
  // async register(user) {
  //   let saltRounds = 10;
  //   var result = await new Promise((resolve, reject) => {
  //     bcrypt.hash(user.password, saltRounds, (err, hash) => {
  //       console.log("HERE");
  //       User.register({ email: "test@gmail.com", status: 0 }, "test@gmail.com");
  //     });
  //   });
  //   console.log(result);
  //   return result;
  // },
  // login(username, password) {
  //   passport.use(
  //     new Strategy(function (username, password, cb) {
  //       User.findOne({}, function (err, user) {
  //         if (err) {
  //           return cb(err);
  //         }
  //         if (!user) {
  //           return cb(null, false);
  //         }
  //         if (user.password != password) {
  //           return cb(null, false);
  //         }
  //         return cb(null, user);
  //       });
  //     })
  //   );
  // },
  async getUser(userID) {
    let result = await User.findById(userID).populate({
      path: "payments",
      populate: {
        path: "admin",
      },
    });
    if (result == null) return null;
    return result;
  },
  async getAllUsers() {
    let result = await User.find().exec();

    return result;
  },
  async updateProfile(user, userID) {
    let updateUser = await User.findById(userID).exec();
    if (updateUser == null) return null;
    updateUser.firstName = user.firstName;

    updateUser.lastName = user.lastName;

    // updateUser.status = user.status == null ? 0 : 1;

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
