import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PythonBasic from "@/pages/PythonBasic";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/python-basic" element={<PythonBasic />} />
      </Routes>
    </Router>
  );
}
