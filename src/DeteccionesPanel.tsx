import React, { useEffect, useState } from 'react';

const tiposResiduoDisponibles = [
  'cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash'
];

export default function DeteccionesPanel() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([]);
  const [detecciones, setDetecciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const toggleTipo = (tipo: string) => {
    setTiposSeleccionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    );
  };

  const obtenerDetecciones = async () => {
    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/detecciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_inicio: fechaInicio + ' 00:00:00',
          fecha_fin: fechaFin + ' 23:59:59'
        })
      });
      const data = await res.json();

      const filtradas = data.filter((d: any) =>
        tiposSeleccionados.length === 0 || tiposSeleccionados.includes(d.label.split(' ')[0])
      );

      setDetecciones(filtradas);
    } catch (err) {
      console.error("Error al obtener detecciones:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Consultar Detecciones</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border p-2" />
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border p-2" />
        <button onClick={obtenerDetecciones} className="bg-blue-500 text-white px-4 py-2 rounded">
          {cargando ? 'Cargando...' : 'Buscar'}
        </button>
      </div>

      <div className="mb-4">
        <label className="font-semibold mb-2 block">Tipos de residuo:</label>
        <div className="flex flex-wrap gap-3">
          {tiposResiduoDisponibles.map(tipo => (
            <label key={tipo} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tiposSeleccionados.includes(tipo)}
                onChange={() => toggleTipo(tipo)}
              />
              {tipo}
            </label>
          ))}
        </div>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Object ID</th>
            <th className="p-2 border">Timestamp</th>
            <th className="p-2 border">Label</th>
            <th className="p-2 border">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {detecciones.length === 0 ? (
            <tr><td colSpan={4} className="text-center p-4">No hay detecciones</td></tr>
          ) : detecciones.map((d, i) => (
            <tr key={i}>
              <td className="border p-2">{d.object_id}</td>
              <td className="border p-2">{d.timestamp}</td>
              <td className="border p-2">{d.label}</td>
              <td className="border p-2">{d.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}