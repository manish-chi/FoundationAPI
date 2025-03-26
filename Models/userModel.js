const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "Please enter valid e-mail address"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "please enter confirm password"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "password doesn't match. Please enter correct password",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user", "lead-guide"],
      message: "value can be admin,user or lead-guide",
    },
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpiresIn: {
    type: Date,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordChangedAt = Date.now() - 1000;

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.verifyPasswords = async (
  userGivenPassword,
  userPassword
) => {
  return await bcrypt.compare(userGivenPassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  let resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.checkPasswordChangedAt = async function (jwtTimeStamp) {
  console.log(this.passwordChangedAt.getTime());
  const changedTimeStamp = parseInt(this.checkPasswordChangedAt / 1000, 10);
  return jwtTimeStamp < changedTimeStamp ? true : false;
};

const userModel = mongoose.model("FoundationUser", userSchema);

module.exports = userModel;
