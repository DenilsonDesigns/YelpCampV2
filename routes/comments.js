const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//Comments new
router.get("/new", isLoggedIn, (req, res) => {
  //FIND campground by ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//comments create
router.post("/", isLoggedIn, (req, res) => {
  //LOOKUP CAMPGROUND USING ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //saave comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComments) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComments
      });
    }
  });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  //FINDBYIDANDREMOVE
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        //does user own the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          //user does not have permission
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
