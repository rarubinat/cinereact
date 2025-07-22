import React, { useContext, useRef } from "react";             // Importamos React, useContext para estado global, y useRef para referencia DOM
import MovieContext from "../../contexts/MovieContext";          // Importamos el contexto para manejar estado global de películas
import "../styles/MovieSelector.css";                           // Importamos estilos específicos para este componente

const MovieSelector = () => {
  // Extraemos del contexto el estado global "movies" y la función "changeState" para actualizarlo
  const { movies, changeState } = useContext(MovieContext);

  // Creamos una referencia para el contenedor de la lista de películas (para hacer scroll)
  const scrollRef = useRef(null);

  // Función que se llama cuando se selecciona una película
  // Recibe el nombre de la película seleccionada
  const handleMovieSelect = (selectedMovie) => {
    // Obtenemos el precio de la película seleccionada desde el estado global
    const newMoviePrice = movies.movieNames[selectedMovie].price;

    // Actualizamos el estado global con la película seleccionada y su precio
    changeState((prevState) => ({
      ...prevState,           // Copiamos el estado anterior
      selectedMovie,          // Actualizamos la película seleccionada
      moviePrice: newMoviePrice, // Actualizamos el precio
    }));
  };

  // Función para desplazar horizontalmente la lista de películas (carousel)
  // Recibe la dirección ("left" o "right")
  const handleScroll = (direction) => {
    // Si la referencia al contenedor existe
    if (scrollRef.current) {
      // Usamos scrollBy para mover la lista 300px a la izquierda o derecha, con animación suave
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // Obtenemos los datos completos de la película seleccionada para mostrar detalles
  const selectedMovieData = movies.movieNames[movies.selectedMovie];

  return (
    <div className="carousel-wrapper">
      {/* Título del selector */}
      <h4>Selecciona una película</h4>

      {/* Contenedor horizontal con lista de películas, referenciado para el scroll */}
      <div className="movie-list" ref={scrollRef}>
        {/* Recorremos todas las películas disponibles */}
        {Object.keys(movies.movieNames).map((movieName, index) => (
          // Cada tarjeta de película es clickeable para seleccionar la película
          <div
            key={index}   // Clave única para React
            className={`movie-card ${
              movies.selectedMovie === movieName ? "selected" : "" // Si esta película está seleccionada, añadimos clase "selected"
            }`}
            onClick={() => handleMovieSelect(movieName)}  // Al hacer clic en la tarjeta, seleccionamos esa película
            style={{ cursor: "pointer" }}                  // Cambiamos el cursor para indicar que es clickeable
          >
            {/* Imagen del póster de la película */}
            <img
              src={movies.movieNames[movieName].image}
              alt={`${movieName} Poster`}
              className="movie-image"
            />
            {/* Mostramos el nombre de la película debajo de la imagen */}
            <div className="movie-name">{movieName}</div>
          </div>
        ))}
      </div>

      {/* Botones para desplazar la lista de películas hacia la izquierda o derecha */}
      <div className="carousel-buttons">
        <button className="scroll-button" onClick={() => handleScroll("left")}>
          &#8249; {/* Flecha izquierda */}
        </button>
        <button className="scroll-button" onClick={() => handleScroll("right")}>
          &#8250; {/* Flecha derecha */}
        </button>
      </div>

      {/* Sección que muestra detalles de la película seleccionada */}
      {selectedMovieData && (
        <div className="movie-details">
          {/* Imagen grande del póster */}
          <img
            src={selectedMovieData.image}
            alt={`${movies.selectedMovie} Poster`}
            className="movie-poster-large"
          />
          <div className="movie-info">
            {/* Nombre de la película */}
            <h2>{movies.selectedMovie}</h2>
            {/* Sinopsis de la película */}
            <p><strong>Sinopsis:</strong> {selectedMovieData.sinopsis}</p>
            {/* Duración de la película */}
            <p><strong>Duración:</strong> {selectedMovieData.duration}</p>
            {/* Fecha de estreno */}
            <p><strong>Fecha de estreno:</strong> {selectedMovieData.releaseDate}</p>
            {/* Género */}
            <p><strong>Género:</strong> {selectedMovieData.genre}</p>
            {/* Lista de directores, uniendo con coma */}
            <p><strong>Director(es):</strong> {selectedMovieData.directors?.join(", ")}</p>
            {/* Lista de autores/escritores */}
            <p><strong>Autor(es):</strong> {selectedMovieData.writers?.join(", ")}</p>
            {/* Clasificación */}
            <p><strong>Clasificación:</strong> {selectedMovieData.rating}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSelector;  // Exportamos el componente para usarlo en otros archivos
