const express = require("express");

const app = express();

const port = 8000;

//listen to app

app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server", err);
  }
  console.log(`App listening on port ${port}`);
});
