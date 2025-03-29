const reviewModel = require("../Models/reviewModel");
const factory = require("../Controllers/handlerFactory");

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;

  if (!req.body.user) req.body.user = req.user._id;

  next();
};

exports.addReview = factory.createOne(reviewModel);

exports.getAllReviews = factory.getAll(reviewModel);

exports.deleteReview = factory.deleteOne(reviewModel);

exports.getReview = factory.getOne(reviewModel);

exports.updateReview = factory.updateOne(reviewModel);
