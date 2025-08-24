import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const Login = ({ embedded = false, onSuccess, setPage }) => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test1234");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
        if (embedded && onSuccess) {
          onSuccess();
        } else {
          navigate("/films");
        }
      }, 800);
    } catch (err) {
      let message = "Usuario o contraseña incorrectos";
      if (err.code === "auth/user-not-found") message = "El usuario no existe";
      else if (err.code === "auth/wrong-password") message = "Contraseña incorrecta";
      else if (err.code === "auth/invalid-email") message = "Correo inválido";

      setError(message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, introduce tu correo para recuperar la contraseña.");
      return;
    }

    try {
      await auth.sendPasswordResetEmail(email);
      setSuccessMsg("Te hemos enviado un correo para restablecer tu contraseña.");
      setError("");
    } catch (err) {
      let message = "Error al intentar recuperar la contraseña.";
      if (err.code === "auth/user-not-found") message = "El usuario no existe.";
      else if (err.code === "auth/invalid-email") message = "Correo inválido.";
      setError(message);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm fixed inset-0 z-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl relative">
        {/* Botón cerrar para embedded modal */}
        {embedded && onSuccess && (
          <div
            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-700 hover:text-black"
            onClick={onSuccess}
          >
            &times;
          </div>
        )}

        <h2 className="text-3xl font-bold text-center text-[#0a1e3f] mb-6">
          Log In
        </h2>

        {successMsg && (
          <div className="mb-4 p-3 rounded bg-green-600 text-white font-semibold text-center">
            {successMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-semibold mt-2"
        >
          Log In
        </button>

        {/* Recuperar contraseña */}
        <p
          onClick={handleResetPassword}
          className="mt-3 text-center text-blue-600 cursor-pointer underline"
        >
          ¿Olvidaste tu contraseña?
        </p>

        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

        <p className="mt-6 text-center text-black">
          Don't have an account?{" "}
          <span
            onClick={() => {
              if (embedded && setPage) {
                setPage("Register");
              } else {
                navigate("/register");
              }
            }}
            className="text-blue-600 cursor-pointer underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
