const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/httperror")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")

// importing our routes
const myRoutes = require("./routes/routes");

// starting the app
const app = express();

// allowing requests through
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// parsing incoming json data
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// parsing cookies on browser
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send(req.cookies);
});

// route for login pages
app.use("/login", myRoutes)
// route for manager pages
app.use("/manager", myRoutes)
// route for employee pages
app.use("/employee", myRoutes)

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message} || "Some random error occurred")
});

app.use((req, res, next) => {
    const error =  new HttpError("Could not find this route", 404);
    throw error;
});

// logging into MongoDB database
mongoose
    .connect("mongodb+srv://ConorK:Arsenal@cluster0.twmjr.mongodb.net/ThinkShift?retryWrites=true&w=majority")
    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err);
    })
