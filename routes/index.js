const express = require("express")
const router = express.Router()
var passport = require("passport")
var User = require("../models/user")
router.get('/', (req, res) => {
    res.render('landing')
  })
  
  
  // AUTH ROUTES
router.get('/register', (req, res) => {
  res.render('register')
})

router.post("/register", (req,res) => {
  var newUser = new User({username: req.body.username})
  if(req.body.adminCode === 'secretcode123') {
    newUser.isAdmin = true
  }
  User.register(newUser, req.body.password, function(err,user) {
    if(err){
      req.flash("error",err.message)
      res.render("register")
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success","Welcome to YelpCamp " + user.username)
      res.redirect("/campgrounds")
    })
  })
})

// SHOW LOGIN FORM
router.get("/login",(req, res) =>{
  res.render('login',{message: req.flash("error")})
})
router.post("/login",passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
  }), (req, res) => {
})

router.get("/logout",(req, res) =>{
  req.logout()
  req.flash("success","You Have Successfully Logged Out Of Yelp Camp")
  res.redirect('/')
})


module.exports = router