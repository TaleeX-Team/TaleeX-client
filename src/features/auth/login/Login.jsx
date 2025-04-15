import React from "react";

const Login = () => {
  return (
    <div className="flex h-screen ">
      {/* Left Section: Form */}
      <div className="flex flex-col justify-center items-center flex-1/2 p-8 bg-white">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="w-3/4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>

      {/* Right Section: Image */}
      <div className="flex-1/2  justify-center items-center hidden sm:flex">
        <img
          className="  md:w-9/12 h-9/12 object-cover border-2 rounded-lg shadow-lg"
          src="/sign-in.jpg"
          alt="Sign In"
        />
      </div>
    </div>
  );
};

export default Login;
