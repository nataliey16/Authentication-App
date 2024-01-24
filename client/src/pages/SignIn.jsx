import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    //... is a strip operator to keep the prev value of sign up data, then [e.target.id] takes new value
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      dispatch(signInStart());
      //prevent refreshing the page when submitting the form
      e.preventDefault();
      //create a req to the database
      //For fetch, the try catch actually doesnt work when setting up error, need only the if statement
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      //get data: convert response to json to see response from backend
      const data = await res.json();

      if (data.success === false) {
        //setError(true);
        dispatch(signInFailure(data));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/"); // If no errors, navigate valid user to home page
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
        >
          {/* If loading, display loading, else display Sign Up */}
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex mt-3">
        <p>Dont have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500 p-1">Sign up</span>
        </Link>
      </div>
      <p className="text-red-600 mt-3">
        {error ? error.message || "Something went wrong!" : " "}
      </p>
    </div>
  );
};

export default SignUp;
