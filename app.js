require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const errorHandler = require("./backend/middleware/handleError");
const path = require('path');


app.use(express.static("./backend/public"));
app.use(express.static("./frontend/dist"));


app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/dist", "index.html"));
});

// any non matching routers
app.all("*", (req, res, next) => {
  next(
    new CustomError(`Cannot find ${req.method} ${req.originalUrl} route !`, 404)
  );
});

// error handler
app.use(errorHandler);

// connect to db and start express server
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully Connected to MongoDB");
    app.listen(3000, () => console.log(`Server is listening on port 3000...`));
  } catch (error) {
    console.log(error);
  }
};

start();
