const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    post_data:{
        type:String
    },
    comments:[],
    createdby:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Posts", postSchema);
