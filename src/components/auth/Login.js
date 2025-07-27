import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const Login = () => {
  const [email, setEmail] = useState("alrubinat@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Control de modal

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setSuccessMsg("");

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const doc = await db.collection("users").doc(user.uid).get();
      if (!doc.exists) {
        setError("Tu cuenta no está habilitada para iniciar sesión.");
        await auth.signOut();
        return;
      }

      setSuccessMsg("Login exitoso");
      setTimeout(() => {
        setIsOpen(false); // Cerramos el modal al tener éxito
        navigate("/films");
      }, 800);
    } catch (err) {
      let message = "Usuario o contraseña incorrectos";
      if (err.code === "auth/user-not-found") message = "El usuario no existe";
      else if (err.code === "auth/wrong-password") message = "Contraseña incorrecta";
      else if (err.code === "auth/invalid-email") message = "Correo inválido";

      setError(message);
    }
  };

  const handleClose = () => {
    setIsOpen(false); // Cerramos el modal
    navigate("/");    // Redirige al home
  };

  if (!isOpen) return null; // Si está cerrado, no renderizamos nada

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Contenedor principal */}
      <div className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        {/* Botón X para cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-[#0a1e3f] mb-6">
          Login
        </h2>

        {successMsg && (
          <div className="mb-4 p-3 rounded bg-green-600 text-white font-semibold text-center">
            {successMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

        <p className="mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer underline"
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
