import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  //request (req) is the data we are getting from the client side
  //response (res) is the data we send back to the client side
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save(); //this is asyncronous, meaning it will take time to save data to db depending on internet, so we add await
    //await tells JS to stay in code until result happens, so we add async to (req,res)
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
