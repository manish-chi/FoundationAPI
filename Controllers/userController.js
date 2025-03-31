const catchAsync = require("../Utilities/catchAsync");
const userModel = require("../Models/userModel");
const factory = require("../Controllers/handlerFactory");

exports.deleteUser = factory.deleteOne(userModel);

exports.UpdateUser = factory.updateOne(userModel);

exports.getAll = factory.getAll(userModel, "name email");

exports.getOne = factory.getOne(userModel);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
