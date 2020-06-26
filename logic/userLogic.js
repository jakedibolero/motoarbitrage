var User = require("../models/user.model");
const bcrypt = require("bcrypt");

module.exports = {
  async register(user) {
    let saltRounds = 10;
    var result = await new Promise((resolve, reject) => {
      bcrypt.hash(user.password, saltRounds, (err, hash) => {
        console.log("HERE");
        User.register({ email: "test@gmail.com", status: 0 }, "test@gmail.com");
      });
    });
    console.log(result);
    return result;
  },
  login(username, password) {
    passport.use(
      new Strategy(function (username, password, cb) {
        User.findOne({}, function (err, user) {
          if (err) {
            return cb(err);
          }
          if (!user) {
            return cb(null, false);
          }
          if (user.password != password) {
            return cb(null, false);
          }
          return cb(null, user);
        });
      })
    );
  },
  async getAllUsers() {
    let result = await User.find({ status: 0 });

    return result;
  },
};
