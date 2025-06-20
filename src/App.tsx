import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ReportesPanel from "./ReportesPanel";
import DeteccionesPanel from "./DeteccionesPanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reporte" element={<ReportesPanel />} />
      <Route path="/detecciones" element={<DeteccionesPanel />} />
    </Routes>
  );
}

export default App;