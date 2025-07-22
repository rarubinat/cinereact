import React, { useState, useEffect } from "react";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";
import firebase from "firebase/app";

const EditProfile = ({ setPage }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Traer los datos del usuario actual
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("No estás autenticado");
          setLoading(false);
          return;
        }

        const userDoc = await db.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            birthdate: data.birthdate ? data.birthdate.toDate().toISOString().slice(0, 10) : "",
            gender: data.gender || "",
          });
        } else {
          setError("No se encontró el perfil del usuario.");
        }
      } catch (err) {
        setError("Error al cargar datos.");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios en Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No estás autenticado");
        return;
      }

      // Validación simple (opcional)
      if (!form.name.trim()) {
        setError("El nombre no puede estar vacío.");
        return;
      }

      await db.collection("users").doc(user.uid).update({
        name: form.name,
        phone: form.phone,
        birthdate: firebase.firestore.Timestamp.fromDate(new Date(form.birthdate)),
        gender: form.gender,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      alert("Perfil actualizado correctamente.");
      setPage("Profile"); // O donde quieras que vaya después
    } catch (err) {
      setError("Error al actualizar el perfil.");
      console.error(err);
    }
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2>Editar Perfil</h2>

      <form onSubmit={handleSubmit}>
        <label>Nombre completo</label><br />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />

        <label>Teléfono (opcional)</label><br />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          pattern="\d*"
          placeholder="Solo números"
        /><br />

        <label>Fecha de nacimiento</label><br />
        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          required
        /><br />

        <label>Género</label><br />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Seleccione género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
          <option value="Prefiero no decir">Prefiero no decir</option>
        </select><br /><br />

        <button type="submit">Guardar Cambios</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => setPage("Profile")} style={{ marginTop: "10px" }}>
        Cancelar
      </button>
    </div>
  );
};

export default EditProfile;
