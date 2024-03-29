import mongoose from "mongoose";

//schema: set of rules and conditions
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // must have a username
      unique: true, // all usernames must be unqiue (aka PRIMARY KEYS)
    },
    email: {
      type: String,
      required: true, // must have a username
      unique: true, // all usernames must be unqiue (aka PRIMARY KEYS)
    },
    password: {
      type: String,
      required: true, // must have a username
    },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  },
  { timestamps: true } // each user will have two timestamps: time of creation and time of edit
);

const User = mongoose.model("User", userSchema);

export default User;
