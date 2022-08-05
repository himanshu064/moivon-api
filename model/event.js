const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,

    },
    price: {
      type: Number,
      required: true,
    },
    images: Array,
    dates: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
    },
    eventOrgDetail: {
      type: String,
 
    },
    published: {
      type: Boolean,
      default: false,
    },
    genre: { type: Schema.Types.ObjectId, ref: "GENRE" },
    type: {
      type: [String],
    },
  },
  { timestamps: true },
  { collection: "events" }
);
module.exports = mongoose.model("events", eventSchema);
