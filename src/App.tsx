import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PythonBasic from "@/pages/PythonBasic";
import DataAnalysis from "@/pages/DataAnalysis";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/python-basic" element={<PythonBasic />} />
        <Route path="/data-analysis" element={<DataAnalysis />} />
      </Routes>
    </Router>
  );
}
