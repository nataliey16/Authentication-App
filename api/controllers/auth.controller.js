import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  //request (req) is the data we are getting from the client side
  //response (res) is the data we send back to the client side
  //next used to utilize middleware to handle the errors
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save(); //this is asyncronous, meaning it will take time to save data to db depending on internet, so we add await
    //await tells JS to stay in code until result happens, so we add async to (req,res)
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body; // verify user using email and password
  try {
    //check if email is correct
    const validUser = await User.findOne({ email }); //Use findOne function from mongoDB to find email from database
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password); //compare inputed password with encrypted password using bcryptjs
    if (!validPassword) return next(errorHandler(401, "Invalid credentials")); // best practise to not tell user what is wrong
    //next add a token - JSON web token (install npm i jsonwebtoken)
    //a token is a hased value of the unqiue things of the use e.g., email, id, username
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //use user ID that is automatically created by mongoDB because this is not publicily known vs email/username
    //encrypt this unqiue info in the token into a cookie on client side (browser). Later, when a user needs to be verified we can use the token
    const { password: hashedPassword, ...rest } = validUser._doc; // remove password from client side for security. Remove password from the email and username
    const expiryDateCookie = new Date(Date.now() + 3600000); //1 hour
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDateCookie,
      }) //httpOnly prevents third party sites from changing the cookie, cookie expires in 1 hour
      .status(200)
      .json(rest); //Only show user's id, email, and username, while hiding password
  } catch (error) {
    next(error); // handle errors
  }
};
