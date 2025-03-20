const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const { isUtf8 } = require("buffer");
const { json } = require("stream/consumers");

dotenv.config({ path: "./config.env" });

let app = express();

app.use(express.json());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);

app.get("/api/v1/tours", (req, res) => {
  let tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
  );
  return res.json({ status: 200, data: tours });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;

  let tour = tours.filter((tour) => {
    return tour.id == id;
  });

  return res.status(200).json({
    status: 200,
    count : tour.length,
    data: tour,
  });
});

app.post("/api/v1/tours", (req, res) => {
  let tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
  );
  let newId = tours[tours.length - 1].id + 1;

  let newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  try {
    fs.writeFileSync(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours)
    );
    return res.status(201).json({
      status: "201",
      data: newTour,
    });
  } catch (err) {
    return res.status(400).json({
      status: "400",
      message: err.message,
    });
  }
});

app.patch("/api/v1/tours/:id", (req, res) => {
  let id = req.params * 1;
  let tour = tours.find((tour) => tour.id === id);
  tour = req.body;
  tours.pop();
  tours.push(tour);
  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tour)
  );

  return res.status(201).json({
    status: "success",
    data: tour,
  });
});

app.delete("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;

  console.log(tours);

  let tour = Array.from(tours).filter((tour) => {
    return tour.id != id;
  });

  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours)
  );

  return res.status(200).json({
    status: 200,
    data: tours,
  });
});

module.exports = app;
