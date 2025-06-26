import { useState } from "react";

const tiposResiduoDisponibles = [
  "CARDBOARD",
  "GLASS",
  "METAL",
  "PAPER",
  "PLASTIC",
  "TRASH",
];

export default function DeteccionesPanel() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([]);
  const [detecciones, setDetecciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const resetFormulario = () => {
    setFechaInicio("");
    setFechaFin("");
    setTiposSeleccionados([]);
    setDetecciones([]);
  };

  const toggleTipo = (tipo: string) => {
    setTiposSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const obtenerDetecciones = async () => {
    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/detecciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_inicio: fechaInicio + " 00:00:00",
          fecha_fin: fechaFin + " 23:59:59",
        }),
      });
      const data = await res.json();

      const filtradas = data.filter(
        (d: any) =>
          tiposSeleccionados.length === 0 ||
          tiposSeleccionados.includes(d.label.split(" ")[0])
      );

      setDetecciones(filtradas);
    } catch (err) {
      console.error("Error al obtener detecciones:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="absolute top-1/2 w-[70vw] h-[140vh] bg-white rounded-l-full shadow-2xl -translate-y-1/2"
        style={{ maxWidth: "700px", right: "-50px" }}
      ></div>
      {/* Formulario y tabla */}
      <div className="relative bg-gray-900 text-gray-100 w-full max-w-4xl p-10 rounded-3xl shadow-xl border border-gray-700 z-10">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Consultar Detecciones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full py-3 px-5 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-400 text-gray-100
              focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600
              transition duration-300 ease-in-out"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full py-3 px-5 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-400 text-gray-100
              focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600
              transition duration-300 ease-in-out"
          />
          <div className="flex flex-row gap-4">
            <button
              onClick={obtenerDetecciones}
              disabled={cargando}
              className={`w-full py-3 rounded-xl font-semibold transition duration-200 ${
                cargando
                  ? "bg-blue-700 cursor-not-allowed text-gray-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {cargando ? "Cargando..." : "Buscar"}
            </button>

            <button
              onClick={resetFormulario}
              className="w-full py-3 rounded-xl font-semibold transition duration-200 bg-gray-600 hover:bg-gray-700 text-white"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-200">
            Tipos de residuo:
          </label>
          <div className="flex flex-wrap gap-6 text-gray-300">
            {tiposResiduoDisponibles.map((tipo) => (
              <label
                key={tipo}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={tiposSeleccionados.includes(tipo)}
                  onChange={() => toggleTipo(tipo)}
                  className="accent-blue-600"
                />
                <span className="capitalize">{tipo}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-sm">
          <table className="w-full table-auto text-gray-100">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 border border-gray-700 text-left">
                  Object ID
                </th>
                <th className="p-3 border border-gray-700 text-left">
                  Timestamp
                </th>
                <th className="p-3 border border-gray-700 text-left">Label</th>
                <th className="p-3 border border-gray-700 text-left">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody>
              {detecciones.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500 italic select-none"
                  >
                    No hay detecciones
                  </td>
                </tr>
              ) : (
                detecciones.map((d, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  >
                    <td className="border border-gray-700 p-2">
                      {d.object_id}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {d.timestamp}
                    </td>
                    <td className="border border-gray-700 p-2">{d.label}</td>
                    <td className="border border-gray-700 p-2">
                      {d.confidence}
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
