// Importaciones necesarias desde React y Firebase
import React, { useState } from "react";
import firebase from "firebase/app"; // Para acceder a firestore.FieldValue
import { auth } from "../../utils/firebase"; // Instancia de autenticación de Firebase
import db from "../../utils/firebase"; // Instancia de Firestore (base de datos)

// Componente funcional Register que recibe una función para cambiar de página (setPage)
const Register = ({ setPage }) => {
  // Estado local que guarda los campos del formulario
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthdate: "",
    gender: "",
    acceptedTerms: false,
  });

  // Estado para mostrar errores al usuario
  const [error, setError] = useState("");

  // Función auxiliar para verificar si el usuario tiene al menos 13 años
  const isOldEnough = (birthdate) => {
    if (!birthdate) return false;
    const today = new Date();
    const birthDateObj = new Date(birthdate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age >= 13;
  };

  // Función para manejar cambios en cualquier input del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Actualiza el campo correspondiente en el estado
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Función principal que maneja el registro del usuario
  const handleRegister = (e) => {
    e.preventDefault(); // Previene el recargo de la página
    setError(""); // Reinicia los errores

    // Validación: debe aceptar los términos
    if (!form.acceptedTerms) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    // Validación: debe tener al menos 13 años
    if (!isOldEnough(form.birthdate)) {
      setError("Debes tener al menos 13 años para registrarte.");
      return;
    }

    // Validación: las contraseñas deben coincidir
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validación: si hay teléfono, debe contener solo números
    if (form.phone && !/^\d+$/.test(form.phone)) {
      setError("El teléfono solo debe contener números.");
      return;
    }

    // Registro del usuario en Firebase Authentication
    auth
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(async (userCredential) => {
        const uid = userCredential.user.uid; // UID único del usuario creado

        // Se guarda la información adicional del usuario en Firestore
        await db.collection("users").doc(uid).set({
          name: form.name,
          email: form.email,
          phone: form.phone,
          birthdate: form.birthdate,
          gender: form.gender,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Marca de tiempo del servidor
        });

        // Mensaje de éxito y redirección al login
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        setPage("Login");
      })
      .catch((err) => {
        // Muestra cualquier error devuelto por Firebase (por ejemplo, email ya registrado)
        setError(err.message);
      });
  };

  // JSX que renderiza el formulario de registro
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleRegister} style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Campo: Nombre completo */}
        <label htmlFor="name">Nombre completo</label><br />
        <input
          id="name"
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          required
        /><br />

        {/* Campo: Correo electrónico */}
        <label htmlFor="email">Correo electrónico</label><br />
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        /><br />

        {/* Campo: Contraseña */}
        <label htmlFor="password">Contraseña</label><br />
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        /><br />

        {/* Campo: Confirmación de contraseña */}
        <label htmlFor="confirmPassword">Confirmar contraseña</label><br />
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        /><br />

        {/* Campo: Teléfono (opcional) */}
        <label htmlFor="phone">Teléfono (opcional)</label><br />
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
        /><br />

        {/* Campo: Fecha de nacimiento */}
        <label htmlFor="birthdate">Fecha de nacimiento</label><br />
        <input
          id="birthdate"
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          required
        /><br />

        {/* Campo: Género (opcional) */}
        <label htmlFor="gender">Género (opcional)</label><br />
        <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Seleccione género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
          <option value="Prefiero no decir">Prefiero no decir</option>
        </select><br /><br />

        {/* Aceptación de términos y condiciones */}
        <label>
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={form.acceptedTerms}
            onChange={handleChange}
          />{" "}
          Acepto los <a href="/terminos" target="_blank" rel="noreferrer">términos y condiciones</a>
        </label><br /><br />

        {/* Botón para enviar el formulario */}
        <button type="submit">Registrarse</button>
      </form>

      {/* Muestra errores en rojo si existen */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* Enlace para redirigir al login si ya tiene cuenta */}
      <p style={{ marginTop: "15px" }}>
        ¿Ya tienes cuenta?{" "}
        <span
          onClick={() => setPage("Login")}
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
        >
          Inicia sesión
        </span>
      </p>
    </div>
  );
};

// Exporta el componente Register para que pueda ser usado en otros archivos
export default Register;
