const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const User = require("./models/user");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const flash = require("connect-flash");

//ROUTES
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

const localDB = "mongodb://localhost/yelp_camp";
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect(process.env.DATABASEURL || localDB);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Function to seed db on boot
// seedDB();

//moment require
app.locals.moment = require("moment");
//passport config
app.use(
  require("express-session")({
    secret: "Pepsi is awesome",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Yelp Camp fired up");
});
