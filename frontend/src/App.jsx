import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import AboutUs from "./components/About/AboutUs";
import Registration from "./components/Users/Register";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Registration />} />
        <Route path="*" element={() => <h1>Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
