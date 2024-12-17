require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Test = require("./backend/models/test");
const authRouter = require("./backend/routes/authRouter");
const eventsRouter = require("./backend/routes/eventsRouter");
const userRouter = require("./backend/routes/userRouter");
const CustomError = require("./backend/utils/customError");
const errorHandler = require("./backend/middleware/handleError");
const cookieParser = require("cookie-parser");
const checkAuth = require("./backend/middleware/checkAuth");
const path = require('path');

app.use(
  cors({
    origin: "*"
  })
);

app.use(express.static("./backend/public"));

app.use(express.json());
app.use(cookieParser());

// For testing purposes
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Hello from the backend express server!",
  });
});

app.post("/api/test", async (req, res) => {
  console.log(req.body);
  const response = await Test.create(req.body);
  console.log(response);
  res.status(201).json({ response });
});

app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/user", checkAuth, userRouter);

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
    app.listen(5000, () => console.log(`Server is listening on port 5000...`));
  } catch (error) {
    console.log(error);
  }
};

start();
