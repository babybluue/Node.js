const express = require("express");
const app = express();
const authRoute = require("./Routes/auth");
const postRoute = require("./Routes/posts");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const verify = require("./Routes/verifyToken");

dotenv.config();
//Connect to Db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(`connected to db!`);
  }
);
//Middleware
app.use(express.json());
//Route middlewares
app.use("/api/user", authRoute);
app.use(verify);
app.use("/api/posts", postRoute);

app.listen(3001, () => console.log("server is running"));
