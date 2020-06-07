const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../schemas/users");
const Posts = require("../schemas/posts");
const JWT_KEY = "secret";
let Authenticator = require("../services/authenticator");

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  User.find({ email: req.body.email }).then(user => {
    if (user.length >= 1) {
      return res.json({
        status: false,
        message: "email already exists"
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.json({
            status: false,
            message: "Server error"
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            name: req.body.username
          });
          user
            .save()
            .then(result => {
              console.log(result);
              res.json({
                status: true,
                message: "User Created"
              });
            })
            .catch(err => {
              res.json({
                status: false,
                message: "Server error"
              });
            });
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length < 1) {
        res.json({
          status: false,
          message: "Invalid Email id"
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (error, result) => {
          if (error) {
            return res.json({
              status: false,
              message: "Invalid Password"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                //generates token
                userId: user[0]._id
              },
              JWT_KEY,
              {
                expiresIn: "24h"
              }
            );
            return res.json({
              status: true,
              message: "Successfully loged in",
              token: token
            });
          }
          res.json({
            status: false,
            message: "Auth failed"
          });
        });
      }
    })
    .catch(err => {
      res.json({
        status: false,
        message: "Server error"
      });
    });
});


// router.get("/fetch",Authenticator.isAuthenticated,(req,res,next)=>{
//   Problem.find({createdby: req.user._id})
//   .then(result => {
//     // console.log(result);
//     const data=chartdata(result,req.user.name,req.user.l_username,req.user.c_username);
//     res.json({
//       status:true,
//       message: "Fetched successfully",
//       data:data
//     });
//   })
//   .catch(err=>{
//     res.json({
//       status:false,
//       message:"Server error"
//     });
//   })
// })

router.get("/fetchallposts",Authenticator.isAuthenticated,(req,res,next)=>{
    //give all posts.
    Posts.find()
    .then((result)=>{
        // console.log(result);
        const dataToSend={
          username:req.user.name,
          data:result
        }
        res.json({
            status:true,
            message:"Fetched Successfully",
            data:dataToSend
        })
    })
    .catch((err)=>{
        res.json({
            status:false,
            message:"Server Error"
        })
    })
})

router.post("/addpost",Authenticator.isAuthenticated,(req,res,next)=>{
    //handle new post.
    const id=req.user._id;
    const new_post = new Posts({
        _id: new mongoose.Types.ObjectId(),
        post_data: req.body.post_data,
        comments:[],
        createdby:id
      });
    new_post.save()
    .then((result)=>{
        res.json({
            status:true,
            message:"Post Added"
        })
    }).catch((err)=>{
        console.log(err);
        res.json({
            status:false,
            message:"Server Error"
        })
    })
})

router.post("/addcomment",Authenticator.isAuthenticated,(req,res,next)=>{
    //handle new comment.
    // console.log(req.body.post_id);
    const id=req.body.post_id;
    Posts.find({_id:id})
    .then((resp)=>{
        console.log(resp[0].comments);
        const dataToSend={
            createdby:req.user,
            comment:req.body.new_comment
        }
        const updated_post=resp[0];
        updated_post.comments.push(dataToSend);
        // console.log(updated_post.comments);
        updated_post.save()
        .then((result)=>{
            // console.log(result);
            res.json({
                status:true,
                message:"comment added."
            })
        })
        .catch((err)=>{
            res.json({
                stauts:false,
                message:"comment not added."
            })
        })
    })
    .catch((err)=>{
        res.json({
            stauts:false,
            message:"Server Error"
        })
    })
})



module.exports = router;