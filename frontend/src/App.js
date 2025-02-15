import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./home";
import About from "./About";
import Contact from "./Contact";
import './index.css';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">I Was There</h1>
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-blue-500">Home</Link></li>
            <li><Link to="/about" className="text-blue-500">About</Link></li>
            <li><Link to="/contact" className="text-blue-500">Contact</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
