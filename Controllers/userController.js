let catchAsync = require("../Utilities/catchAsync");
const userModel = require("../Models/userModel");

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const user = await userModel.findByIdAndDelete({ _id: id });

  if (!user) next(new AppError("user no longer exits", 400));

  return res.status(200).json({
    status: "success",
    message: "user has been deleted",
    data: user,
  });
});

exports.UpdateUser = catchAsync(async (req, res, next) => {});

exports.Me = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
});
