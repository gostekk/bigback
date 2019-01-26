const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config");

// REST Api
const liquid = require("./routes/api/liquid");
const lies = require("./routes/api/lies");

// REST Show
const liesShow = require("./routes/show/lies");

const app = express();

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

// Routes
app.use("/api/liquid", liquid);
app.use("/api/lies", lies);
app.use("/show/lies", liesShow);

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);

module.exports = app;