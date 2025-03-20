let app = require("./app.js");
let mongoose = require("mongoose");

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

let server = app.listen(process.env.PORT, () => {
  console.log(`server connection established at ${process.env.PORT}`);
});
