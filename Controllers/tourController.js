const fs = require("fs");
const Tour = require("../Models/tourModel");
const { json } = require("stream/consumers");

exports.top5CheapTours = async (req, res, next) => {
  let query = Tour.find();
  query = query.sort({ price: -1 });
  query = query.limit(5);
  let tours = await query;

  return res.status(200).json({
    status: "success",
    data: tours,
  });

  next();
};

exports.checkPrice = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: "fail",
      message: "price not given and name",
    });
  }
  next();
};

exports.createTour = async (req, res) => {
  try {
    let tour = await Tour.create(req.body);
    return res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (ex) {
    return res.status(400).json({
      status: "failed",
      error: ex.message,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    let queryObj = { ...req.query };

    console.log(queryObj);

    let queryString = JSON.stringify(queryObj);

    const excludedFields = ["limit", "sort", "page"];

    excludedFields.forEach((ele) => delete queryObj[ele]);

    let query = Tour.find(queryObj);

    if (req.query.limit) {
      console.log(req.query.limit);
      query = query.limit(req.query.limit);
    }

    if (req.query.sort) {
      console.log(req.query.sort);
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
  } catch (err) {
    return res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getTour = async (req, res) => {
  try {
    if (req.params.id == null) throw new Error("request id is missing");

    const tour = await Tour.findById(req.params.id);

    return res.status(200).json({
      status: 200,
      count: tour.length,
      data: tour,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (tour == null) throw new Error("Unable to find tour with given id");

    return res.status(200).json({
      status: 200,
      data: tour,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
