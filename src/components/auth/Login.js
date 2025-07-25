import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const Login = () => {
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
        navigate("/films");
      }, 1500); // espera 1.5 seg para mostrar mensaje
    } catch (err) {
      let message = "Usuario o contraseña incorrectos";
      if (err.code === "auth/user-not-found") message = "El usuario no existe";
      else if (err.code === "auth/wrong-password") message = "Contraseña incorrecta";
      else if (err.code === "auth/invalid-email") message = "Correo inválido";

      setError(message);
    }
  };

  return (
    <div className="home-page-wrapper data-modal-toggle">
      <div className="home-page">
        <h2>Login</h2>

        {successMsg && (
          <div className="mb-4 p-3 rounded bg-green-600 text-white font-semibold">
            {successMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <p className="mt-4">
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
