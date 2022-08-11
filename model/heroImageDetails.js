const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const heroImageDetailsSchema = new Schema(
  {
    images: Array,
    description: {
      type: String,
    },
  },
  { timestamps: true },
  { collection: "heroImageDetails" }
);
module.exports = mongoose.model("heroImageDetails", heroImageDetailsSchema);
