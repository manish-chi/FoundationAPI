const express = require("express");
const tourController = require("../Controllers/tourController");

const tourRouter = express.Router();

tourRouter
  .route("/")
  .post(tourController.checkPrice, tourController.createTour)
  .get(tourController.getAllTours);

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
