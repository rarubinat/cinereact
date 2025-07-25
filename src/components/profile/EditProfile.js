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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setForm({
              name: data.name || "",
              phone: data.phone || "",
              birthdate: data.birthdate && data.birthdate.toDate
                ? data.birthdate.toDate().toISOString().slice(0, 10)
                : "",
              gender: data.gender || "",
            });
            setError("");
          } else {
            setError("No se encontró el perfil del usuario.");
          }
        } catch {
          setError("Error al cargar datos.");
        }
      } else {
        setError("No estás autenticado");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No estás autenticado");
        return;
      }
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
      setPage("Profile");
    } catch (err) {
      setError("Error al actualizar el perfil.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Editar Perfil</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nombre completo</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Teléfono (opcional)</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            pattern="\d*"
            placeholder="Solo números"
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fecha de nacimiento</label>
          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Género</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccione género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
