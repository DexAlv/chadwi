import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportesPanel() {
  useEffect(() => {
    const tipo = localStorage.getItem("tipo_usuario");
    if (tipo !== "admin") {
      navigate("/");
    }
  }, []);
  const [inicio, setFechaInicio] = useState("");
  const [fin, setFechaFin] = useState("");
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

  const generar = async () => {
    const usuario_id = localStorage.getItem("usuario_id");
    const fecha_inicio = inicio + " 00:00:00";
    const fecha_fin = fin + " 23:59:59";

    if (!usuario_id) return;

    try {
      const res = await fetch("http://localhost:5000/generar_reporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha_inicio, fecha_fin, usuario_id }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Error: " + error.error);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_detecciones.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error al generar el reporte:", error);
    }
  };

  const eliminarReporte = async (id: number) => {
    if (!window.confirm("¿Eliminar este reporte?")) return;
    try {
      const res = await fetch(`http://localhost:5000/reportes/${id}`, {
        method: "DELETE",
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
    <div className="relative min-h-screen bg-gray-900 text-white px-4 py-12 flex flex-col items-center justify-start">
      {/* Círculo decorativo */}
      <div
        className="absolute top-1/2 w-[70vw] h-[140vh] bg-white rounded-l-full shadow-2xl -translate-y-1/2"
        style={{ maxWidth: "700px", right: "-50px" }}
      ></div>

      <div className="w-full max-w-5xl bg-gray-800 p-10 rounded-3xl shadow-xl z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Reportes</h2>
          <button
            onClick={() => navigate("/detecciones")}
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl text-white font-medium"
          >
            Ver Detecciones
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="date"
            value={inicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <input
            type="date"
            value={fin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            onClick={generar}
            disabled={loading}
            className={`px-4 py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-blue-700 cursor-not-allowed text-gray-300"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Reportes generados</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-600">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="p-3 border border-gray-600">ID</th>
                <th className="p-3 border border-gray-600">Archivo</th>
                <th className="p-3 border border-gray-600">Fecha</th>
                <th className="p-3 border border-gray-600">Usuario</th>
                <th className="p-3 border border-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-400">
                    No hay reportes
                  </td>
                </tr>
              ) : (
                reportes.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-700 transition">
                    <td className="p-3 border border-gray-600">{r.id}</td>
                    <td className="p-3 border border-gray-600 text-blue-400">
                      <a
                        href={`http://localhost:5000/${r.archivo_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {r.nombre_reporte}
                      </a>
                    </td>
                    <td className="p-3 border border-gray-600">
                      {r.fecha_generacion}
                    </td>
                    <td className="p-3 border border-gray-600">{r.usuario}</td>
                    <td className="p-3 border border-gray-600">
                      <button
                        onClick={() => eliminarReporte(r.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
