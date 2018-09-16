const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Function to seed db on boot
seedDB();

//Display landing page
app.get("/", (req, res) => {
  res.render("landing");
});

//Displaying list of campgrounds
app.get("/campgrounds", (req, res) => {
  //GET ALL CAMPGROUNDS FROM DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: campgrounds });
    }
  });
});

//Display new campground form
app.get("/campgrounds/new", (req, res) => {
  res.render("new.ejs");
});

//SHOW- Shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
  //FIND CAMPGROUND WITH PROVIDED ID,
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        //RENDER SHOW TEMPLATE OF THAT CAMPGROUND
        res.render("show", { campground: foundCampground });
      }
    });
});

app.post("/campgrounds", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const newCampground = { name: name, image: image, description: desc };
  //CREATE A NEW CAMPGROUND AND SAVE TO DB
  Campground.create(newCampground, (err, newCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.listen(3000, () => {
  console.log("YelpCamp fired up");
});
