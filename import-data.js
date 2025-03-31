const fs = require("fs");
const mongoose = require("mongoose");
const tourModel = require("./Models/tourModel");
const reviewModel = require("./Models/reviewModel");
const userModel = require("./Models/userModel");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

let dbConnectionString = process.env.DBCONNECTION.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

dbConnectionString = dbConnectionString.replace(
  "<USERNAME>",
  process.env.DB_USERNAME
);

const conn = mongoose
  .connect(dbConnectionString)
  .then((conn) => {
    console.log(`connection successful`);
    console.log(conn.connections);
  })
  .catch((err) => {
    console.log(`${err}`);
  });

let tours = fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, "utf-8");
let reviews = fs.readFileSync(
  `${__dirname}/dev-data/data/reviews.json`,
  "utf-8"
);
let users = fs.readFileSync(`${__dirname}/dev-data/data/users.json`, "utf-8");

async function insertData() {
  try {
    await tourModel.create(JSON.parse(tours));
    await userModel.create(JSON.parse(users));
    await reviewModel.create(JSON.parse(reviews));
    console.log("data has been imported");
  } catch (err) {
    console.log(err.message);
  }
}

async function deleteData() {
  try {
    await tourModel.deleteMany();
    await userModel.deleteMany();
    await reviewModel.deleteMany();
    console.log("tours have been deleted");
  } catch (err) {
    console.log(err.message);
  }
}

if (process.argv[2] == "--import") {
  console.log("Ye!!!!");
  insertData();
} else if (process.argv[2] == "--delete") {
  deleteData();
}
