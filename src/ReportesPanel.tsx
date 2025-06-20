import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function ReportesPanel() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [usuarioId, setUsuarioId] = useState(1); // Ajusta según tu auth
  const [reportes, setReportes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchReportes = async () => {
    try {
      const res = await fetch("http://localhost:5000/reportes");
      const data = await res.json();
      setReportes(data);
    } catch (err) {
      console.error("Error al cargar reportes:", err);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const generarReporte = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/generar_reporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_inicio: fechaInicio + " 00:00:00",
          fecha_fin: fechaFin + " 23:59:59",
          usuario_id: usuarioId
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Reporte generado correctamente");
        fetchReportes();
      } else {
        alert(data.error || "Error al generar reporte");
      }
    } catch (err) {
      console.error("Error generando reporte:", err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarReporte = async (id: number) => {
    if (!window.confirm("¿Eliminar este reporte?")) return;
    try {
      const res = await fetch(`http://localhost:5000/reportes/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Reporte eliminado");
        fetchReportes();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Generar nuevo reporte</h2>
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded m-4"  
              onClick={() => navigate("/detecciones")}>
                  Ver detecciones
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border p-2" />
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border p-2" />
          <button onClick={generarReporte} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-3">Reportes existentes</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Archivo</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Usuario</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-4">No hay reportes</td></tr>
            ) : reportes.map((r: any) => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2 text-blue-600">
                  <a href={`http://localhost:5000/${r.archivo_pdf}`} target="_blank" rel="noopener noreferrer">
                    {r.nombre_reporte}
                  </a>
                </td>
                <td className="border p-2">{r.fecha_generacion}</td>
                <td className="border p-2">{r.usuario}</td>
                <td className="border p-2">
                  <button onClick={() => eliminarReporte(r.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}