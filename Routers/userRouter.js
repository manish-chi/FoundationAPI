const express = require("express");
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const handlerFactory = require("../Controllers/handlerFactory");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/updatePassword").patch(authController.updatePassword);
router.route("/getMe").get(userController.getMe, userController.getOne);
router.route("/:id").delete(userController.deleteUser);

module.exports = router;
