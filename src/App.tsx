import { useEffect, useState } from "react";
import LoginForm from "./LoginForm"; // Asegúrate de que la ruta sea correcta

import "./App.css";

function App() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  // Verifica si ya hay sesión activa
  useEffect(() => {
    const tipo = localStorage.getItem("tipo_usuario");
    if (tipo) setTipoUsuario(tipo);
  }, []);

  // Actualiza la imagen cada segundo
  useEffect(() => {
    if (!tipoUsuario) return;
    /* const intervalId = setInterval(() => {
      setImg(`http://localhost:5000/video_feed?time=${new Date().getTime()}`);
    }, 1000);

    return () => clearInterval(intervalId); */
  }, [tipoUsuario]);

  // Acciones al loguearse
  const handleLogin = (tipo: string) => {
    localStorage.setItem("tipo_usuario", tipo);
    setTipoUsuario(tipo);
  };

  const handleLogout = () => {
    localStorage.removeItem("tipo_usuario");
    setTipoUsuario(null);
  };

  const click = async () => {
    const usuario_id = localStorage.getItem("usuario_id");
    const fecha_inicio = "2025-06-19 16:48:35";
    const fecha_fin = "2025-06-19 16:57:09";

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

  // Si no está logueado, mostrar formulario de login
  if (!tipoUsuario) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Si está logueado, mostrar interfaz principal
  return (
    <>
      <nav className="bg-[#778da9]">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-white">
            Detección automática de residuos
          </h1>
          <div className="flex gap-4">
            {tipoUsuario === "admin" && (
              <button
                className="flex gap-2 items-center bg-[#f0f0f0] text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#62b6cb] hover:text-white transition duration-400 ease-in-out"
                onClick={click}
              >
                <p>Generar reporte</p>
                <i>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </i>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <div
        className="flex justify-center items-center overflow-hidden"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <img
          src="/video_feed"
          alt="Video feed"
          className="object-contain h-full w-full max-w-full"
        />
      </div>
    </>
  );
}

export default App;
