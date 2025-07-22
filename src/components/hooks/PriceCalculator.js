import React, { useContext } from "react";
import MovieContext from "../../contexts/MovieContext"; // Importa el contexto MovieContext

const PriceCalculator = ({ selectedTime, selectedSeats}) => {  
  const { movies } = useContext(MovieContext); // Obtiene el estado del contexto MovieContext

  return (
    <div>      
      <p>
        Seleccionadas {movies.totalSeats} sillas y el total del precio es{" "}
        {movies.totalSeats * movies.moviePrice} €
      </p>
      {/* Calcula y muestra el precio total en función del número de asientos seleccionados
           y el precio de la película obtenido del contexto MovieContext */}
    </div>
  );
};

export default PriceCalculator; // Exporta el componente PriceCalculator
