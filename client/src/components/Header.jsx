import Switch from "@mui/material/Switch";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function Label({ text }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black px-4 py-1 text-sm font-medium text-white">
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
          <img src="client/src/assets/icons8-elden-ring-96.png" />
          <h1 className="text-4xl font-serif text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-yellow-600 drop-shadow-md">
            Elden Ring Build Rater
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-xl" text="Dark Mode" />
          <Switch/>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Header;
