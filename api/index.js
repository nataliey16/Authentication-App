import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
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

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

// Path: api/index.js

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
