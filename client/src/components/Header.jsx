import Switch from "@mui/material/Switch";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import HomePage from "./HomePage";

function Label({ text }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-900 px-4 py-1 text-sm font-medium text-white">
      {text}
    </span>
  );
}
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Header() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="inline-flex w-full flex-row justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="client/src/assets/icons8-elden-ring-96.png"
              alt="Elden Ring Logo"
              className="h-20 w-20"
            />
            <h1 className="text-4xl font-serif text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-yellow-600 drop-shadow-md">
              Elden Ring Build Rater
            </h1>
          </Link>
        </div>

        {/* implement DarkMode with switch */}
        <div className="flex items-center gap-3">
          <button className="rounded-md bg-black px-4 py-2 text-xl font-semibold text-white">
            <Link to="/login">Log In</Link>
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xl font-semibold text-black">
            <Link to="/signup">Sign Up</Link>
          </button>
          <Label className="text-xl" text="Dark Mode" />
          <Switch />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Header;
