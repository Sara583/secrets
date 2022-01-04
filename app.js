//jshint esversion:6
const dotenv=require("dotenv").config();
const express= require("express");
const bodyParser= require("body-parser");
const app = express();
const mongoose =require("mongoose");
const passport=require('passport');
const passportlocal=require("passport-local");
const passportlocalmongoose=require("passport-local-mongoose");
const session=require("express-session");
//const bcrypt = require('bcrypt');
//const saltRounds = 10;
//const md5 =require("md5");
//const encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB");
//const userSchema=new mongoose.Schema({
  const userSchema=new mongoose.Schema({
  email :String,
  password:String
});
userSchema.plugin(passportlocalmongoose);

//userSchema.plugin(encrypt, {secret:process.env.SECRETS, encryptedFields: ['password']});
const User=mongoose.model("User",userSchema);
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
  const user= new User ({
  username:req.body.username,
   password :req.body.password
 });

User.register({username:req.body.username},req.body.password,function(err,user){
  if(err){
    console.log(err);
    res.redirect('/register');
  }else{
    passport.authenticate("local")(req,res,function(){
      res.redirect('/secrets');
    });
  }
});














//  bcrypt.genSalt(saltRounds, function(err, salt) {
//    bcrypt.hash(req.body.password, salt, function(err, hash) {

  //    const  newUser= new User({
    //      email:req.body.username,
      //    password:hash
        //});
//
//        newUser.save(function(err){
  //        if(err){
    //        console.log(err);
      //    }else{
        //    res.render("secrets")
          //}
    //    });
  //    });
  //  });
});

app.post("/login",function(req,res){

  username=req.body.username;
   password =req.body.password;

  req.login(username, function(err) {
    if (err) { console.log(err);
     }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
});

























//const username=req.body.username;
//const password=req.body.password;
//User.findOne({email:username},function(err,foundEmails){
  //if(!err){
    //if(foundEmails){
      //bcrypt.compare(password,foundEmails.password, function(err, result) {
    //if(result===true){
      //res.render("secrets");
  //  }
//  });


  //  }
//  }else{
  //  console.log(err);
//  }
//});



















app.listen(3000,function(){
    console.log("Server started working on port 3000")
  });
