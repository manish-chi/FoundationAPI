const express = require("express");

const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.protect);

reviewRouter
  .route("/")
  .post(
    authController.restrictTo(["user"]),
    reviewController.setTourUserIds,
    reviewController.addReview
  )
  .get(reviewController.getAllReviews);

reviewRouter
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo(["user", "admin"]),
    reviewController.deleteReview
  );

module.exports = reviewRouter;
