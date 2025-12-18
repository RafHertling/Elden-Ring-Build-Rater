import './App.css'
import Header from './components/Header'
import HomePage from './components/HomePage'
import Imporessum from './components/Impressum'
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

export default function App() {
  return (
    <>
      <header>
      <Header />
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
      <footer>
        <Imporessum/>
      </footer>
    </>
  );
}


