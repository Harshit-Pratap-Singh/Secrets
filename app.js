
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
// const md5=require("md5");

const app=express();
const bcrypt = require('bcrypt');
const rounds=10;

mongoose.connect("mongodb://localhost:27017/secretDB",{useNewUrlParser : true, useUnifiedTopology: true});

app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static("public"));

const userSchema=new mongoose.Schema({
  name : String ,
  password : String
});
const User=new mongoose.model("User",userSchema);

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
  bcrypt.hash(req.body.password,rounds,function(err,hash){
    const user=new User({
      name: req.body.username,
      password: hash
    });
    user.save(function(err){
      if(err)console.log(err);
      else res.render("secrets");
    });
  });
});

app.post("/login",function(req,res){
  User.findOne({name: req.body.username},function(err,found){
    if(err)console.log(err);
    else {
      if(found){
          bcrypt.compare(req.body.password,found.password,function(err){
        if(found)res.render("secrets");
      });
      }
    }
  });
});








app.listen(3000,function(){
  console.log("server running at 3000");
});
