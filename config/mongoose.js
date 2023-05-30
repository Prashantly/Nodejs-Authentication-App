const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/Auth_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Equivalent code without bind
db.on("error", (error) => {
  console.error("Error connecting to MongoDB", error);
});

db.once("open", function () {
  console.log("connected to Database : MongoDB");
});

module.exports = db;
