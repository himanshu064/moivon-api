const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const heroImageSchema = new Schema(
  {
    image:{
        type:String,
        required: true
    },
    heroImageId: {
        type:String,
        required: true
    },
  },
  { timestamps: true },
  { collection: "heroImage" }
);
module.exports = mongoose.model("heroImage", heroImageSchema)