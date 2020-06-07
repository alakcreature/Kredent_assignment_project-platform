const express = require("express");
const app = express();
var cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const api = require("./api/api");
require("dotenv").config();


mongoose
  .connect(
    process.env.mongodb_password,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(err => {
    console.log(err);
  });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/", api);

// app.get("/",(req,res)=>{
//     res.json({
//         status:true,
//         message:"Sahi hai"
//     })
// })

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
