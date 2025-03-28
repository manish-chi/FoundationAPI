const fs = require("fs");
const mongoose = require("mongoose");
const tourModel = require("./Models/tourModel");
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

async function insertData() {
  try {
    await tourModel.create(JSON.parse(tours));
  } catch (err) {
    console.log(err.message);
  }
}

async function deleteData() {
  try {
    await tourModel.deleteMany();
    console.log("tours have been deleted");
  } catch (err) {
    console.log(err.message);
  }
}

if (process.argv[2] == "--import") {
  insertData();
  process.exit(0);
} else if (process.argv[2] == "--delete") {
  deleteData();
  process.exit(0);
}
