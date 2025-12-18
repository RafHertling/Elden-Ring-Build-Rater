import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-yellow-400 mb-6">
          Login
        </h1>
        <form className="space-y-4">
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
            className="w-full py-2 px-4 mt-4 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/password-reset" className="text-sm text-yellow-400 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
