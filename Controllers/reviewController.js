const catchAsync = require("../Utilities/catchAsync");
const reviewModel = require("../Models/reviewModel");

exports.addReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;

  if (!req.body.user) req.body.user = req.user._id;

  const reviewBody = {
    review: req.body.review,
    rating: req.body.rating,
    user: req.body.user,
    tour: req.body.tour,
  };

  const review = await reviewModel.create(reviewBody);

  return res.status(201).json({
    status: "success",
    data: review,
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  let reviews = {};

  if (!req.params.tourId) {
    reviews = await reviewModel.find();
  } else {
    reviews = await reviewModel.find({ tour: req.params.tourId });
  }

  if (!reviews)
    next(
      new AppError(
        "Oops,reviews are still not provided to any of our tours!",
        404
      )
    );
  return res.status(200).json({
    status: "success",
    data: reviews,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await reviewModel.findByIdAndDelete({ _id: req.params.id });

  if (!review) next(new AppError("Review with given ID not found", 400));

  return res.status(200).json({
    status: "success",
    data: review,
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await reviewModel.findById({ _id: req.params.id });

  if (!review) next(new AppError("Review with given ID not found", 400));

  return res.status(200).json({
    status: "success",
    data: review,
  });
});
