const express = require("express");
const tourController = require("../Controllers/tourController");
const authController = require("../Controllers/authController");
const reviewRouter = require("../Routers/reviewRouter");

const tourRouter = express.Router();

tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter.use(authController.protect);

tourRouter.route("/top-5-cheap-tours").get(tourController.top5CheapTours);

tourRouter
  .route("/")
  .post(
    authController.restrictTo(["admin", "guide"]),
    tourController.createTour
  )
  .get(tourController.getAllTours);


tourRouter.use(authController.restrictTo(["admin", "guide"]));

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
