const Tour = require("../Models/tourModel");
const catchAsync = require("../Utilities/catchAsync");

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

exports.createTour = catchAsync(async (req, res) => {
  let tour = await Tour.create(req.body);
  return res.status(200).json({
    status: "success",
    data: tour,
  });
});

exports.getAllTours = catchAsync(async (req, res) => {
  let queryObj = { ...req.query };

  console.log(queryObj);

  const excludedFields = ["limit", "sort", "page"];

  excludedFields.forEach((ele) => delete queryObj[ele]);

  let query = Tour.find(queryObj);

  if (req.query.limit) {
    query = query.limit(req.query.limit);
  }

  if (req.query.sort) {
    query = query.sort(req.query.sort.split(",").join(" "));
  }

  if (req.query.page) {
    let page = req.query.page || 1;
    let limit = req.query.limit || 100;
    let skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit).page(page);
  }

  const tours = await query;

  return res.status(200).json({ status: "success", data: tours });
});

exports.getTour = catchAsync(async (req, res) => {
  if (req.params.id == null) throw new Error("request id is missing");

  const tour = await Tour.findById(req.params.id);

  return res.status(200).json({
    status: 200,
    count: tour.length,
    data: tour,
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (tour == null) throw new Error("Unable to find tour with given id");

  return res.status(200).json({
    status: 200,
    data: tour,
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(201).json({
    status: "success",
    data: tour,
  });
});
