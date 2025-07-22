import React from 'react';              // Importamos React para usar JSX y componentes
import '../styles/DateBlock.css';        // Importamos los estilos específicos para este componente

// Función que formatea una fecha en formato estándar 'YYYY-MM-DD'
// Sirve para normalizar fechas y compararlas fácilmente
const formatDate = (date) => {
  if (!date) return "";                 // Si no se recibe fecha, devuelve cadena vacía
  const d = new Date(date);             // Creamos un objeto Date con la fecha
  return d.toISOString().split('T')[0]; // Convertimos a formato ISO y tomamos solo la parte de la fecha
};

// Función que formatea una fecha en un formato amigable para mostrar al usuario
// Aquí se usa el idioma español para mostrar día de la semana, día, mes y año completos
const formatFriendlyDate = (date) => {
  if (!date) return "";                 // Si no hay fecha, devolvemos cadena vacía
  const d = new Date(date);             // Creamos objeto Date
  // Usamos toLocaleDateString con opciones para mostrar formato legible y en español
  return d.toLocaleDateString('es-ES', { 
    weekday: 'long',   // Día de la semana completo (ej: lunes)
    day: 'numeric',    // Día numérico (ej: 7)
    month: 'long',     // Mes completo (ej: julio)
    year: 'numeric'    // Año completo (ej: 2025)
  });
};

// Componente funcional DateBlock recibe dos props:
// selectedDate: la fecha actualmente seleccionada
// handleDateChange: función para actualizar la fecha seleccionada al hacer click en un botón
const DateBlock = ({ selectedDate, handleDateChange }) => {
  // Creamos un array de 7 días consecutivos empezando desde hoy
  // Cada día tendrá dos propiedades: 'date' en formato 'YYYY-MM-DD' y 'label' amigable para mostrar en botón
  const days = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date();             // Tomamos la fecha actual
    day.setDate(day.getDate() + index); // Sumamos index para obtener los próximos 7 días

    return {
      date: formatDate(day),            // Fecha en formato estándar para comparar y pasar como valor
      label: day.toLocaleDateString('es-ES', { 
        weekday: 'short',               // Día de la semana corto (ej: lun)
        day: 'numeric',                 // Día del mes (ej: 7)
        month: 'short'                  // Mes corto (ej: jul)
      }) 
    };
  });

  return (
    <div>
      <h4>Selecciona la Fecha</h4>

      {/* Mostramos la fecha seleccionada en formato amigable con negrita */}
      <p>Fecha seleccionada: {selectedDate ? formatFriendlyDate(selectedDate) : "Ninguna"}</p>

      <div className="week-days">
        {/* Recorremos el array de días para mostrar un botón por cada fecha */}
        {days.map((day, idx) => (
          <button
            key={idx}                                     // Key único para React (índice del día)
            className={`day-button ${selectedDate === day.date ? 'selected' : ''}`} // Clase 'selected' si la fecha es la actual seleccionada
            onClick={() => handleDateChange(day.date)}   // Al clickear, se actualiza la fecha seleccionada
          >
            {day.label}                                  {/* Mostrar etiqueta amigable en el botón */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateBlock;
