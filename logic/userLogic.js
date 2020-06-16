const User = require("../models/user.model");
const bcrypt = require("bcrypt");

module.exports = {
  async register(user) {
    let saltRounds = 10;
    var result = await new Promise((resolve, reject) => {
      bcrypt.hash(user.password, saltRounds, (err, hash) => {
        console.log("HERE");
        User.register({ email: "test@gmail.com", status: 0 }, "test@gmail.com");
        // User.findOne({ email: user.email }, (err, data) => {
        //   if (data == null) {
        //     let newUser = Object.assign(new User(), user);
        //     newUser.dateCreated = Date.now();
        //     newUser.password = hash;
        //     newUser.status = 0;
        //     newUser.save();
        //     result = {
        //       status: 200,
        //       message: "Successfully registered user!",
        //     };
        //     resolve(result);
        //   } else {
        //     console.log("Here0");
        //     result = { status: 300, message: "Email is already in use" };
        //     resolve(result);
        //   }
        // });
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
};
