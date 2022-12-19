const mongoose = require("mongoose");
require("dotenv").config();

const server = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
); //get database string (to connect mongodb atlas to nodejs and express)and place holder password

//1st arg (connection string ) 2nd arg (some options for coneections)
//mongoose.connect return promise
//after promise resolved call back function at (then) will be excuted
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
