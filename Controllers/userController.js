let catchAsync = require("catchAsync");
const userModel = require("../Models/userModel");

exports.DeleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.userId;

  const user = await userModel.findByIdAndDelete({ _id: new ObjectId(id) });

  if (!user) next(new AppError("user no longer exits", 400));

  return res.status(200).json({
    status: "success",
    message: "user has been deleted",
    data: user,
  });
});

exports.UpdateUser = catchAsync(async (req, res, next) => {});
