const express = require("express");
const tourController = require("../Controllers/tourController");
const authController = require("../Controllers/authController");

const tourRouter = express.Router();

tourRouter.route("/top-5-cheap-tours").get(tourController.top5CheapTours);

tourRouter
  .route("/")
<<<<<<< Updated upstream
  .post(tourController.checkPrice, tourController.createTour)
  .get(authController.protect, tourController.getAllTours);
=======
  .post(authController.restrictTo(['admin']),tourController.createTour)
  .get(tourController.getAllTours);
>>>>>>> Stashed changes

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
