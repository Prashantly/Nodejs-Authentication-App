const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const app = express();

const port = 8000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./assets"));
app.use(expressLayouts);
//extract styles and scripts from subpages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setup view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "Authentication",
    secret: "nodeAuth",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//user express router
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server", err);
  }
  console.log(`App listening on port ${port}`);
});
