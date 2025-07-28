import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const Login = ({ embedded = false, onSuccess, setPage }) => {
  const [email, setEmail] = useState("alrubinat@gmail.com");
  const [password, setPassword] = useState("123456");
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
          onSuccess(); // Cierra el modal
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

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl">
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
          className="mb-3 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Log In
        </button>

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
