const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

//Displaying list of campgrounds
router.get("/", (req, res) => {
  //GET ALL CAMPGROUNDS FROM DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds
      });
    }
  });
});

//NEW - Display new campground form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new.ejs");
});

//SHOW- Shows more info about one campground
router.get("/:id", (req, res) => {
  //FIND CAMPGROUND WITH PROVIDED ID,
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(foundCampground);
        //RENDER SHOW TEMPLATE OF THAT CAMPGROUND
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//CREATE - Post new campground
router.post("/", isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author
  };

  //CREATE A NEW CAMPGROUND AND SAVE TO DB
  Campground.create(newCampground, (err, newCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
