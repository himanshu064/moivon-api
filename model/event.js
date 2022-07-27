const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema(
  {
    title:{
        type: String,
        required: true
    },
    decription:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
    },
    dates:{
        type: Date,
        required: true
    },
    genre: { type: Schema.Types.ObjectId, ref: 'GENRE' },
    venue:{
        type: String,
        required: true
    },
    eventOrgDetail:{
        type: String,
        required: true
    },
    type:{
        type: [String],

    },
  },
  { timestamps: true },
  { collection: "events" }
);
module.exports = mongoose.model("events", eventSchema);
