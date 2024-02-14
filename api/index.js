import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose
  .connect(process.env.MONGO_DATABASE)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json()); // allow json as our input from our backend

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

// Path: api/index.js

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//Adding a middleware: Middleware is software that different applications use to communicate with each other.
//This handles the errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; //500 is the interal server error
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message, //error message
    statusCode,
  });
});
