const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const newsLetterSchema = new Schema(
  {
    email:{
        type:String,
        required: true
    }
  },
  { timestamps: true },
  { collection: "newsLetter" }
);
module.exports = mongoose.model("newsLetter", newsLetterSchema)