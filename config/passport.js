var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user.model");

module.exports = function (passport) {
  //passport  serialize and unserialize users out of session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // ======================SIGNUP ===========================
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
        // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        // User.findOne won't fire unless data is sent back
        process.nextTick(function () {
          // find a user whose email is the same as the forms email
          User.findOne({ email: email.toLowerCase() }, function (err, user) {
            if (err) return done(err);

            if (user) {
              return done(
                null,
                false,
                req.flash("error", "That email is already taken.")
              );
            } else {
              // if there is no user with that email -create the user
              let newUser = Object.assign(new User(), req.body);
              newUser.dateCreated = Date.now();
              newUser.status = 0;
              newUser.password = newUser.generateHash(password);
              newUser.email = email.toLowerCase();
              newUser.role = "customer";
              // save the user
              newUser.save(function (err) {
                req.flash(
                  "message",
                  "Account created. Please wait for activation."
                );
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // =================LOCAL LOGIN ======================================

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        // find a user whose email is the same as the forms email
        User.findOne({ email: email }, function (err, user) {
          if (err) return done(err);
          if (!user)
            return done(null, false, req.flash("error", "No user found.")); // req.flash is the way to set flashdata using connect-flash
          if (!user.validPassword(password))
            return done(null, false, req.flash("error", "Oops wrong password")); // create the loginMessage and save it to session as flashdata
          if (!user.activeUser(user))
            return done(
              null,
              false,
              req.flash("error", "Account is still disabled")
            );
          // all is well, return successful user
          return done(null, user);
        });
      }
    )
  );
};
