const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    max: [5, "the highest rating must be 5"],
    min: [0, "the lowest rating should not be below 0"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "foundationUsers",
    required : [true,'user id must be provided']
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "foundationTours",
    required :[true,'tour id must be provided']
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  }).populate({
    path: "tour",
    select: "name",
  });
  next();
});

let reviewModel = mongoose.model("foundationReviews", reviewSchema);

module.exports = reviewModel;
