import './App.css'
import Header from './components/Header'
import HomePage from './components/HomePage'
import Imporessum from './components/Impressum'

export default function App() {
  return (
    <>
      <header>
      <Header />
      </header>
      <HomePage/>
      <footer>
        <Imporessum/>
      </footer>
    </>
  );
}


