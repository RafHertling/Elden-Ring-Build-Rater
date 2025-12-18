import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const backgrounds = [
    "/client/src/assets/background.webp",
    "/client/src/assets/background2.webp",
    "client/src/assets/background3.webp",
  ];

  const [currentBackground, setCurrentBackground] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-1000"
      style={{ backgroundImage: `url(${backgrounds[currentBackground]})` }}
    >
      <div className="flex flex-col justify-items-center w-full max-w-3xl text-center">
        <h1 className="mx-auto max-w-xl text-5xl font-extrabold leading-tight text-black">
          Every one says your <br />
          build is shit? <br />
          Test it.
        </h1>

        <p className="mt-6 text-l text-gray-800">
          Let me rate your Elden Ring build.
        </p>

        <div className="mt-20 flex items-center justify-center gap-4">
          <button className="rounded-md bg-black px-4 py-2 text-s font-semibold text-white">
            <Link to="/login">Log In</Link>
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-s font-semibold text-black">
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;