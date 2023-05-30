const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

const app = express();

const port = 8000;

app.use(express.static("./assets"));
app.use(expressLayouts);
//extract styles and scripts from subpages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setup view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//user express router
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server", err);
  }
  console.log(`App listening on port ${port}`);
});
