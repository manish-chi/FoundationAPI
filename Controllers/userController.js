const catchAsync = require("../Utilities/catchAsync");
const userModel = require("../Models/userModel");
const factory = require("../Controllers/handlerFactory");

exports.deleteUser = factory.deleteOne(userModel);

exports.UpdateUser = factory.updateOne(userModel);

exports.getAll = factory.getAll(userModel, "name email");

exports.getOne = factory.getOne(userModel);

exports.Me = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
});
