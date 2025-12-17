import Switch from "@mui/material/Switch";

function Label({ text }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black px-4 py-1 text-sm font-medium text-white">
      {text}
    </span>
  );
}

function Header() {
  return (
    <div className="inline-flex w-full flex-row justify-between">
      <div className="flex items-center">
        <img src="client/src/assets/icons8-elden-ring-96.png" />
        <h1>Elden Ring Tracker</h1>
      </div>

      <div className="flex items-center gap-3">
        <Label text="Dark Mode" />
        <Switch />
      </div>
    </div>
  );
}

export default Header;
