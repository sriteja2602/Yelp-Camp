const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require("mongoose")
const Campground = require("./models/campground")
const Comment = require("./models/comment")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const methodOverride = require("method-override")
const User = require("./models/user")
seedDB = require("./seeds")
var campgroundRoutes = require("./routes/campgrounds")  
var commentRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")
const bodyparser =require("body-parser")

// mongoose.connect("mongodb://localhost/yelp_camp") 


mongoose.connect("mongodb+srv://sriteja:Teja20001$@cluster0.69rbm.mongodb.net/yelp_camp",{
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to DB')
  console.log('Yelpcamp started at http://localhost:8080/')  
}).catch(err => {
  console.log('ERROR',err.message)
})




mongoose.set('useFindAndModify', false);
app.use(bodyparser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))

//seedDB()

app.use(require("express-session")({
  secret:"Miata is the best car!!",
  resave: false,
  saveUninitialized: false
})
)
app.locals.moment = require('moment');
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function (req,res,next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next()
})
app.use(indexRoutes)
app.use(campgroundRoutes)
app.use(commentRoutes)

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8080;
// }
app.listen(port);

// app.listen(8080, () => {
//   console.log(`Yelpcamp started at http://localhost:${8080}`)
// })

