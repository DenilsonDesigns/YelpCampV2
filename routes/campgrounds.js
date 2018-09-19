const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res) {
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    // Get all campgrounds from DB
    Campground.find({ name: regex }, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        if (allCampgrounds.length < 1) {
          req.flash("error", "Campground not found");
          return res.redirect("back");
        }
        res.render("campgrounds/index", {
          campgrounds: allCampgrounds,
          noMatch: noMatch
        });
      }
    });
  } else {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {
          campgrounds: allCampgrounds,
          noMatch: noMatch
        });
      }
    });
  }
});

//NEW - Display new campground form
router.get("/new", middleware.isLoggedIn, (req, res) => {
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

//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  //FIND and update the correct campground
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//CREATE - Post new campground
router.post("/", middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const price = req.body.price;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {
    name: name,
    price: price,
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

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
