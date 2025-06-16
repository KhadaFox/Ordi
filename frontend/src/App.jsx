import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import "./App.css";
import ComandaEntry from "./components/ComandaEntry";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/comanda-entry" element={<ComandaEntry />}></Route>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
