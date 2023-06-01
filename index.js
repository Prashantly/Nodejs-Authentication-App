const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

const app = express();

const port = 8000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./assets"));
app.use(expressLayouts);

//extract styles and scripts from subpages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setup view engine
app.set("view engine", "ejs");
app.set("views", "./views");

const uri = "mongodb://127.0.0.1/Auth_app";

const store = MongoStore.create({
  mongoUrl: uri,
  collectionName: "sessions",
  autoRemove: "disabled",
});

//mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "Authentication",
    secret: "nodeAuth",
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//user express router
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server", err);
  }
  console.log(`App listening on port ${port}`);
});
