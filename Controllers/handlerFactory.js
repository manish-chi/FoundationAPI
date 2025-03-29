const catchAsync = require("../Utilities/catchAsync");
const AppError = require("../Utilities/appError");
const AppFeatures = require("../Utilities/appFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    let doc = await Model.create(req.body);
    return res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model, selectOptions) =>
  catchAsync(async (req, res, next) => {
    //nested get all reviews on tours
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    console.log(filter);

    if (selectOptions) query = query.select(selectOptions);

    let query = Model.find(filter);

    let appFeatures = new AppFeatures(req.query, query)
      .filter()
      .sort()
      .pagination()
      .limit();

    let docs = await appFeatures.query;

    if (!docs)
      next(new AppError("please query again by providing proper fields", 401));

    return res
      .status(200)
      .json({ status: "success", count: docs.length, data: docs });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError("Unable to find document with given id", 400));

    return res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id) next(new AppError("please provide a valid Id", 400));

    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    let doc = await query;

    if (!doc) {
      next(new AppError("Document with given id has not been found", 404));
    }

    return res.status(200).json({
      status: 200,
      data: doc,
    });
  });
