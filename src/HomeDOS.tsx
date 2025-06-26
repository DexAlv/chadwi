import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";

function HomeDOS() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const [trackerType, setTrackerType] = useState("KCF");
  const [intervalo, setIntervalo] = useState(30);
  const [umbral, setUmbral] = useState(0.6);

  useEffect(() => {
    const tipo = localStorage.getItem("tipo_usuario");
    if (tipo) setTipoUsuario(tipo);
  }, []);

  const handleLogin = (tipo: string) => {
    localStorage.setItem("tipo_usuario", tipo);
    setTipoUsuario(tipo);
  };

  const handleLogout = () => {
    localStorage.removeItem("tipo_usuario");
    setTipoUsuario(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/set_config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracker_type: trackerType,
          detection_interval: intervalo,
          umbral: umbral,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert("Error: " + data.error);
      } else {
        alert("✅ Configuración enviada con éxito.");
      }
    } catch (error) {
      alert("❌ Error al enviar la configuración.");
      console.error(error);
    }
  };

  if (!tipoUsuario) return <LoginForm onLogin={handleLogin} />;

  return (
    <>
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Detección automática de residuos
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="flex flex-col md:flex-row h-[calc(100vh-64px)] max-w-7xl mx-auto mt-10 mb-16 px-4 gap-8">
        {/* Video */}
        <section className="flex-1 bg-gray-900 rounded-3xl shadow-xl border border-gray-700 p-4 flex items-center justify-center">
          <div className="w-full h-full max-w-4xl max-h-[80vh] border-4 border-gray-700 rounded-3xl overflow-hidden shadow-lg">
            <img
              src="/video_feed"
              alt="Video feed"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        </section>

        {/* Formulario */}
        <section className="w-full max-w-md bg-gray-900 text-gray-100 rounded-3xl shadow-xl border border-gray-700 p-10 flex flex-col justify-start overflow-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold mb-8 text-center">Configuración</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-300">
                Tipo de tracker:
              </label>
              <select
                value={trackerType}
                onChange={(e) => setTrackerType(e.target.value)}
                className="w-full rounded-xl bg-gray-800 border border-gray-700 text-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              >
                <option value="KCF">KCF</option>
                <option value="CSRT">CSRT</option>
                <option value="MIL">MIL</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-300">
                Intervalo de detección:{" "}
                <span className="text-blue-500">{intervalo} segundos</span>
              </label>
              <input
                type="range"
                min={1}
                max={120}
                value={intervalo}
                onChange={(e) => setIntervalo(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-300">
                Umbral de confianza:{" "}
                <span className="text-blue-500">
                  {Math.round(umbral * 100)}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={umbral * 100}
                onChange={(e) => setUmbral(Number(e.target.value) / 100)}
                className="w-full accent-blue-600"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Enviar configuración
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default HomeDOS;
