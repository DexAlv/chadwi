import { useState } from "react";
import type { FormEvent } from "react";

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Credenciales inválidas");
      } else {
        localStorage.setItem("tipo_usuario", data.tipo);
        localStorage.setItem("usuario_id", data.usuario_id);
        onLogin(data.tipo);
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden px-4">
      {/* Medio círculo grande de fondo */}
      <div
        className="absolute top-1/2 w-[70vw] h-[140vh] bg-white rounded-l-full shadow-2xl -translate-y-1/2"
        style={{ maxWidth: "700px", right: "-50px" }}
      ></div>

      {/* Formulario centrado arriba del medio círculo */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-gray-900 text-gray-100 w-full max-w-md p-10 rounded-3xl shadow-xl border border-gray-700 z-10"
      >
        <h2 className="text-4xl font-bold mb-8 text-center">Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full mb-6 py-3 px-5 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-400 text-gray-100
    focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600
    transition duration-300 ease-in-out"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full mb-6 py-3 px-5 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-400 text-gray-100
    focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600
    transition duration-300 ease-in-out"
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-6">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition duration-200 ${
            loading
              ? "bg-blue-700 cursor-not-allowed text-gray-300"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
