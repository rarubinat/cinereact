import React, { useState } from "react";
import '../styles/App.css';
import { auth } from "../../utils/firebase"; // Importa la autenticación de Firebase
import db from "../../utils/firebase"; // Importa Firestore para consultar usuarios

const Login = ({ setPage }) => {
  // Estado para almacenar el email, con valor predefinido
  const [email, setEmail] = useState("alrubinat@gmail.com");
  // Estado para almacenar la contraseña, con valor predefinido
  const [password, setPassword] = useState("123456");
  // Estado para manejar mensajes de error y mostrarlos al usuario
  const [error, setError] = useState("");

  // Función que se ejecuta al hacer click en el botón "Entrar"
  const handleLogin = async () => {
    setError(""); // Limpiar errores previos

    try {
      // Intentar hacer login con el email y contraseña usando Firebase Auth
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user; // Obtener el usuario autenticado

      // Consultar Firestore para verificar si existe un documento con el uid del usuario
      const doc = await db.collection("users").doc(user.uid).get();
      if (!doc.exists) {
        // Si no existe el documento, mostrar error y cerrar sesión
        setError("Tu cuenta no está habilitada para iniciar sesión.");
        await auth.signOut(); // Cierra sesión si el usuario no está registrado en Firestore
        return; // Salir de la función para que no continúe
      }

      // Si todo está OK, mostrar alerta y cambiar de página
      alert("Login exitoso");
      setPage("ViewReservations"); // Cambia la vista a la página de reservas
    } catch (err) {
      // Captura errores específicos y muestra mensajes personalizados
      let message = "Usuario o contraseña incorrectos";
      if (err.code === "auth/user-not-found") message = "El usuario no existe";
      else if (err.code === "auth/wrong-password") message = "Contraseña incorrecta";
      else if (err.code === "auth/invalid-email") message = "Correo inválido";

      setError(message); // Actualiza el estado de error para mostrarlo en la UI
    }
  };

  return (
    <div className="home-page-wrapper">
      <div className="home-page">
        <h2>Login</h2>
        {/* Input para el correo electrónico */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Actualiza el estado email al escribir
        />
        <br />
        {/* Input para la contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Actualiza el estado password al escribir
        />
        <br />
        {/* Botón para iniciar sesión */}
        <button onClick={handleLogin}>Entrar</button>
        {/* Mostrar mensaje de error si existe */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          ¿No tienes cuenta?{" "}
          {/* Enlace para cambiar a la página de registro */}
          <span
            onClick={() => setPage("Register")}
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
