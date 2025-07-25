import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-widest text-blue-400 uppercase">
        Bienvenido a CineReact
      </h1>
      <p className="text-lg md:text-xl max-w-xl text-center mb-8 font-light text-gray-300">
        Tu lugar para descubrir, reservar y disfrutar las mejores películas.
        Explora nuestra selección, revisa tus reservas y mantén tu perfil actualizado.
      </p>
      <div className="flex space-x-6">
        <Link
          to="/films"
          className="px-8 py-3 border border-blue-500 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition"
        >
          Ver Películas
        </Link>
        <Link
          to="/login"
          className="px-8 py-3 border border-green-500 text-green-400 rounded-md hover:bg-green-500 hover:text-white transition"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
};

export default Home;

