import { useEffect, useState } from "react";
import LoginForm from "./LoginForm"; // Asegúrate de que la ruta sea correcta

import "./App.css";

function Home() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  // Verifica si ya hay sesión activa
  useEffect(() => {
    const tipo = localStorage.getItem("tipo_usuario");
    if (tipo) setTipoUsuario(tipo);
  }, []);

  // Acciones al loguearse
  const handleLogin = (tipo: string) => {
    localStorage.setItem("tipo_usuario", tipo);
    setTipoUsuario(tipo);
  };

  const handleLogout = () => {
    localStorage.removeItem("tipo_usuario");
    setTipoUsuario(null);
  };

  if (!tipoUsuario) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      <nav className="bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wide select-none">
            Detección automática de residuos
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white font-semibold py-2 px-5 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-red-400"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main
        className="bg-gray-800 flex justify-center items-center overflow-hidden"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <img
          src="/video_feed"
          alt="Video feed"
          className="object-contain max-h-[90%] max-w-[90%] rounded-lg"
          style={{ aspectRatio: "16 / 9" }}
        />
      </main>
    </>
  );
}

export default Home;
