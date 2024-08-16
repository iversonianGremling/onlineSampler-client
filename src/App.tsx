import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import SampleList from "./components/pages/SampleList";
import About from "./components/pages/AboutPage";
import SampleEdit from "./components/pages/SampleEdit";
import BackButton from "./components/NavBar/BackButton";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="content" style={{ padding: "20px", color: "#333" }}>
        <Routes>
          <Route path="/" element={<SampleList />} />
          <Route path="/about" element={<About />} />
          <Route path="/sampleEdit" element={<SampleEdit />} />
          <Route path="*" element={<SampleList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
