const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const tourRouter = require("./Routers/tourRouter");
const userRouter = require("./Routers/userRouter");
const globalErrorHandler = require("./Controllers/errorController");
<<<<<<< Updated upstream
=======
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
>>>>>>> Stashed changes

dotenv.config({ path: "./config.env" });

let app = express();

app.use(express.json());

<<<<<<< Updated upstream
=======
app.use(helmet());

app.use(xss());

app.use(mongoSanitize());

app.use(hpp());

>>>>>>> Stashed changes
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

<<<<<<< Updated upstream
=======
// const limiter = rateLimit({
//   windowMs: 100,
//   max: 1,
//   message: "Too many requests from this IP, please try again later.",
// });

// app.use(limiter);

>>>>>>> Stashed changes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

module.exports = app;
