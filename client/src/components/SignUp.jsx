import React from "react";
import {Link} from "react-router-dom"

function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-r from-gray-900 to-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-center from-yellow-400 to-yellow-600 drop-shadow-md mb-3">
          Sign Up
        </h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 mt-4 bg-blue-600 text-black font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Create Account
          </button>
          <div className="mt-4  text-center">
             <Link to="/login" className="text-sm text-blue-400 hover:underline">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;