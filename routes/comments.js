const express = require("express")
const router = express.Router()
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")

router.get('/campgrounds/:id/comments/new',middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err)
    } else {
      res.render('comments/new',{campground: campground})
    }
  })
})
  
router.post('/campgrounds/:id/comments',middleware.isLoggedIn,(req, res) => {
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err)
      res.redirect("/campgrounds")
    } else {
      Comment.create(req.body.comment, function(err,comment){
        if (err) {
          console.log(err)
        }
        else {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect('/campgrounds/' + campground._id);
        }
      })
    }
  })
})

router.get('/campgrounds/:id/comments/:comment_id/edit',middleware.checkCommentOwnership,(req,res) => {
  Comment.findById(req.params.comment_id, function (err,foundComment){
    if (err) {
      console.log(err)
    }
    else {
      res.render("comments/edit",{campground_id: req.params.id, comment: foundComment})
    }
  })
})

router.put('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwnership,(req,res) => {
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedComment) {
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

router.delete('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwnership,(req,res) => {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })  
})



module.exports = router