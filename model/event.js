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
      required: true,
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
      required: true,
    },
    eventOrgDetail: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
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
