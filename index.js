const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

const port = 8000;

app.use(expressLayouts);

//setup view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//user express router
app.use("/", require("./routes/index"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server", err);
  }
  console.log(`App listening on port ${port}`);
});
