// all middleware goes here
var Campground = require("../models/campground")
var Comment = require("../models/comment")

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function (req,res, next) {
    if(req.isAuthenticated()) {
      Campground.findById(req.params.id,function (err,foundCampground) {
        if (err) {
          req.flash("error","Campground Not Found")
          res.redirect("back")
        }
        else {
          if (foundCampground.author.id.equals(req.user._id)){
              next()
          }
          else {
            req.flash("error", "You do not have permission to do that!")
            res.redirect("back")
          }
        }
      })
    }
    else {
      res.redirect("/login")
    }
}
middlewareObj.checkCommentOwnership = function (req,res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id,function (err,foundComment) {
          if (err) {
            res.redirect("back")
          }
          else {
            if (foundComment.author.id.equals(req.user._id)){
                next()
            }
            else {
              res.redirect("back")
            }
          }
        })
    }
    else {
        res.redirect("/login")
    }
}

middlewareObj.isLoggedIn = function (req,res,next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash("error","You need to login to do that!!")
    res.redirect('/login')
}
module.exports = middlewareObj