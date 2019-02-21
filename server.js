const express = require("express");
const mongoose = require("mongoose");
const logger = require('morgan');
const bodyParser = require("body-parser");
const config = require("./config");

// REST Api
const liquid = require("./routes/api/liquid");
const lies = require("./routes/api/lies");
const npcs = require("./routes/api/npcs");

// REST Show
const liesShow = require("./routes/show/lies");
const npcsShow = require("./routes/show/npcs");

const app = express();

// Logger
app.use(logger('dev'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = config.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

// Routes
app.use("/api/liquid", liquid);
app.use("/api/lies", lies);
app.use("/api/npcs", npcs);
app.use("/show/lies", liesShow);
app.use("/show/npcs", npcsShow);

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);

module.exports = app;