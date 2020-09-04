const express = require("express");
require("express-async-errors");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const errorHandler = require("./utils/errorHandle");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

dotenv.config();

const db = process.env.Mongo_URI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

require("./routes/passport");

app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static("build"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __dirname + "/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.filename + ".png");
//   },
// });
// const upload = multer({ storage: storage });

app.use((req, res, next) => {
  res.locals.success_info = req.flash("success_info");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");
  res.locals.logout = req.flash("logout");
  res.locals.file_success = req.flash("file_success");
  res.locals.file_error = req.flash("file_error");
  next();
});
app.use("/index", require("./routes/login"));
app.use("/", require("./routes/user"));
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
