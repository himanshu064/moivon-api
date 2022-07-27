const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const genreSchema = new Schema(
  {
    genre:{
        type:String,
        required: true
    }
  },
  { timestamps: true },
  { collection: "genre" }
);
module.exports = mongoose.model("genre", genreSchema)