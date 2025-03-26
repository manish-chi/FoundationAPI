const jwt = require("jsonwebtoken");
const catchAsync = require("../Utilities/catchAsync");
const userModel = require("../Models/userModel");
const AppError = require("../Utilities/appError");
const sendMail = require("../Utilities/nodeMailer");
const crypto = require("crypto");

exports.signup = catchAsync(async (req, res) => {
  let { email, name, password, passwordConfirm } = { ...req.body };

  let newUserData = {
    email: email,
    name: name,
    password: password,
    passwordConfirm: passwordConfirm,
  };

  const user = await UserModel.create(newUserData);

  sendJWTToken(user, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = { ...req.body };

  if (!email) next(new AppError("Please provide email address", 400));

  if (!password) next(new AppError("Please provide password"));

  let user = await userModel.findOne({ email: email });

  if (!user) {
    next(new AppError("User is not found", 400));
  }

  if (!(await user.verifyPasswords(password, user.password))) {
    next(new AppError("Password is incorrect please check", 401));
  }

  req.user = user;

  sendJWTToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    next(new AppError("Authorization is not present", 400));
  }

  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) next(new AppError("Sorry,token is absent", 400));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let user = await UserModel.findOne({ _id: decoded.id });

  if (!user) {
    next(new AppError("User with email address doesnt exists!", 403));
  }

  if (!user.checkPasswordChangedAt(decoded.iat)) {
    next(new AppError("User has changed his/her password, Please login again"));
  }

  req.user = user;

  next();
});

exports.restrictTo = (roles) => {
  return catchAsync((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError("User is not permitted to access this route", 401));
    }
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log("you are doing good job!!!");

  const { email } = { ...req.body };

  const user = await userModel.findOne({ email: email });

  if (!user) next(new AppError("user with given email is not present", 401));

  let resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const URL = `Please send PATCH request to http://${req.hostname}:${req.socket.localPort}/api/v1/users/resetPassword/${resetToken}.If you have already sent, please ignore.`;

  try {
    let options = {
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message: URL,
    };

    console.log(req);

    await sendMail(options);

    return res.status(200).json({
      status: "success",
      message: "resetToken has been sent to the mail",
    });
  } catch (err) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.token;

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  let user = await userModel.findOne({
    passwordResetToken: passwordResetToken,
    passwordResetTokenExpiresIn: { $gt: Date.now() },
  });

  if (!user) {
    next(
      new AppError(
        "Sorry, password reset token has been expired or is incorrect. Please request for another token using /forgotPassword endpoint",
        401
      )
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetTokenExpiresIn = undefined;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now() - 1000;

  await user.save({ validateBeforeSave: true });

  return res.status(200).json({
    status: "success",
    message: "Your password has been successfully reset!",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { email } = { ...req.body };

  if (!email) next(new AppError("Please provide email", 400));

  let user = await userModel.findOne({ email: email });

  if (!user)
    next(new AppError("User with given email address could not be found", 400));

  if (!user.verifyPasswords(req.body.currentPassword, user.password)) {
    next(new AppError("Sorry, password is incorrect", 403));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();

  await userModel.create(user);

  return res.status(200).json({
    status: "success",
    data: user,
  });
});

function sendJWTToken(user, res) {
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(200).json({
    status: "success",
    token: token,
    user: user,
  });
}
