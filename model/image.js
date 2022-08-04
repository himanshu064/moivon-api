const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const imageSchema = new Schema(
  {
    image:{
        type:String,
        required: true
    },
    eventId: {
        type:String,
        required: true
    },
  },
  { timestamps: true },
  { collection: "image" }
);
module.exports = mongoose.model("image", imageSchema)