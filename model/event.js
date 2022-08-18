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
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "image",
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    eventOrgDetail: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    mostPopular: {
      type: Boolean,
      default: false,
    },
    upComing: {
      type: Boolean,
      default: false,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "genre",
    },
    type: {
      type: [String],
    },
  },
  { timestamps: true },
  { collection: "events" }
);
module.exports = mongoose.model("events", eventSchema);
