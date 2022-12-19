const mongoose = require("mongoose");
require("dotenv").config();

const server = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("DB connection sucesssful!"));

const port = process.env.port || 3000;
server.listen(port, () => console.log(`App running on port ${port}!`));
