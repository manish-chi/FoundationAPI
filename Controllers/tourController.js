const tourModel = require("../Models/tourModel");
const catchAsync = require("../Utilities/catchAsync");
const factory = require("../Controllers/handlerFactory");

exports.top5CheapTours = catchAsync(async (req, res, next) => {
  let query = Tour.find();
  query = query.sort({ price: -1 });
  query = query.limit(5);
  let tours = await query;

  return res.status(200).json({
    status: "success",
    data: tours,
  });
});

exports.checkPrice = catchAsync((req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: "fail",
      message: "price not given and name",
    });
  }
  next();
});

exports.createTour = factory.createOne(tourModel);

exports.getAllTours = factory.getAll(tourModel);

exports.getTour = factory.getOne(tourModel, "reviews");

exports.deleteTour = factory.deleteOne(tourModel);

exports.updateTour = factory.updateOne(tourModel);
