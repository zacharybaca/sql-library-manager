var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { sequelize } = require("./models/index.js");

/*Next Step: Create page-not-found template to use Error Page Endpoint*/

(async () => {
  await sequelize.sync({
    force: true,
  });
  try {
    await sequelize.authenticate();
    console.log("Connection Successful");
  } catch (error) {
    console.error("Error connecting: ", error);
  }
})();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// 404 Error Handler
app.use((req, res, next) => {
  const err = new Error("Error 404");
  err.status = 404;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res
      .status(404)
      .render("page-not-found", { err: err.message, status: err.status });
  } else {
    err.message =
      err.message || "A server error has occurred, please try again later.";
    res
      .status(err.status || 500)
      .render("error", { err: err.message, status: err.status });
  }
});

module.exports = app;
