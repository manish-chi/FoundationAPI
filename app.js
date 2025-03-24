const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const tourRouter = require("./Routers/tourRouter");
//const userRouter = require("./Routers/userRouter");

dotenv.config({ path: "./config.env" });

let app = express();

app.use(express.json());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}


app.use("/api/v1/tours", tourRouter);
//app.use("/api/v1/users", userRouter);

module.exports = app;
