const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const heroImageDetailsSchema = new Schema(
  {
    images: Array,
    description: {
      type: String,
    },
    images: [{
      type: mongoose.Schema.Types.ObjectId,
        ref: "heroImage"
    }],
  },
  { timestamps: true },
  { collection: "heroImageDetails" }
);
module.exports = mongoose.model("heroImageDetails", heroImageDetailsSchema);
