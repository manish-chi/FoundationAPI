const jwt = require("jsonwebtoken");
const catchAsync = require("../Utilities/catchAsync");
const userModel = require("../Models/userModel");
const AppError = require("../Utilities/appError");
const sendMail = require("../Utilities/nodeMailer");
const crypto = require("crypto");

exports.signup = catchAsync(async (req, res) => {
  let { email, name, password, passwordConfirm, role } = { ...req.body };

  let newUserData = {
    email: email,
    name: name,
    password: password,
    passwordConfirm: passwordConfirm,
    role: role,
  };

  const user = await userModel.create(newUserData);

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

  let currentUser = await userModel.findOne({ _id: decoded.id });

  if (!currentUser) {
    next(
      new AppError(
        "You are not authorized to access this route, please try to login again, if problem persists please contact admin",
        403
      )
    );
  }

  if (!currentUser.checkPasswordChangedAt(decoded.iat)) {
    next(new AppError("User has changed his/her password, Please login again"));
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError(
          `${
            req.user.role
          } is not permitted to access this route. This route is permitted to ${roles
            .join(",")
            .toString()}`,
          401
        )
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
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

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };

  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  return res.status(200).json({
    status: "success",
    token: token,
    user: user,
  });
}
