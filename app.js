const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");

dotenv.config({ path: "./config.env" });

let app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  let tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
  );
  return res.json({ status: 200, data: tours });
});

module.exports = app;
