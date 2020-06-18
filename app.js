var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const passport = require("passport");
var flash = require("connect-flash");
const connectEnsureLogin = require("connect-ensure-login");

var app = express();
var db = require("./db");
var schedule = require("./utils/scheduler");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

////Session Setup
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

///Router setup
//Handlign routers
require("./config/passport")(passport);
var indexRouter = require("./routes/index")(passport);
var usersRouter = require("./routes/users")(passport);
app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
