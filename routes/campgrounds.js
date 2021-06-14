const express = require("express")
const campground = require("../models/campground")
const router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")

router.get('/campgrounds', (req, res) => {
  Campground.find({}, function(err,allcampgrounds) {
    if(err){
      console.log(err)
    } else {
      res.render('campgrounds/index',{campgrounds: allcampgrounds})
    }
  })
})


router.get('/campgrounds/new',middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/campgrounds', middleware.isLoggedIn,(req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,image: image, description: desc, price: price, author: author}
    
    Campground.create(newCampground,function(err,newlyCreated){
      if(err){  
        console.log(err)
      } else {
          
          res.redirect('/campgrounds')
      }
    })
})

router.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
      console.log(err)
    } else {
      res.render('campgrounds/show',{campground: foundCampground})
        }
    })
})
// Show more details of the specific campground
 


router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,(req,res) => {
    Campground.findById(req.params.id, function (err,foundCampground) {
        res.render('campgrounds/edit',{campground: foundCampground}) 
    })
})

router.put('/campgrounds/:id', middleware.checkCampgroundOwnership,(req,res) => {
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,updatedCampground) {
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

router.delete('/campgrounds/:id',middleware.checkCampgroundOwnership,(req,res) => {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/campgrounds')
    }
  })  
})



module.exports = router