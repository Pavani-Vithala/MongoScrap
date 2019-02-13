var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
// Use morgan logger for logging requests
app.use(logger("dev"));


// Connect to the Mongo DB
mongoose.connect("mongodb://test:Passw0rd@ds125225.mlab.com:25225/mongoscrap", { useNewUrlParser: true });

// Routes
require("./routes/apiRoutes")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
