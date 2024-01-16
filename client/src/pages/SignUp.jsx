import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [signUpData, setSignUpData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    //... is a strip operator to keep the prev value of sign up data, then [e.target.id] takes new value
    setSignUpData({ ...signUpData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      setError(false);
      //prevent refreshing the page when submitting the form
      e.preventDefault();
      //create a req to the database
      //For fetch, the try catch actually doesnt work when setting up error, need only the if statement
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });
      //get data: convert response to json to see response from backend
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex mt-3">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500 p-1">Sign in</span>
        </Link>
      </div>
      <p className="text-red-600 mt-3">{error && "Something went wrong!"}</p>
    </div>
  );
};

export default SignUp;
