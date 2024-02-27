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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc; // remove password from client side for security. Remove password from the email and username
      const expiryDateCookie = new Date(Date.now() + 3600000); //1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDateCookie,
        })
        .status(200)
        .json(rest); //Only show user's id, email, and username, while hiding password; //httpOnly prevents third party sites from changing the cookie, cookie expires in 1 hour
    } else {
      //if user does not exist
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //create a random password of numbers and letters with 8 digits.  36 is any # from 0-9 and any alphabet from a-z (in total 36 values)
      //Each random # is converted to # or letter.
      //0.923456 converts to
      //0.gjwb098767 then count 8 from end and keep the first 8 and remove .0
      //gjwb0987
      //added another Math.random to have a 16 digit password that is more secure
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profileImage: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDateCookie = new Date(Date.now() + 3600000); //1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDateCookie,
        })
        .status(200)
        .json(rest); //Only show user's id, email, and username, while hiding password; //httpOnly prevents third party sites from changing the cookie, cookie expires in 1 hour
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};
