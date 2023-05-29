const express = require("express");

const app = express();

const port = 8000;

//user express router
app.use("/", require("./routes/index"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server", err);
  }
  console.log(`App listening on port ${port}`);
});
