import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Star, Armchair, Palette, Car, Volume2 } from "lucide-react";
import moviesData from "../data/moviesData";

const Home = () => {
  const navigate = useNavigate();
  const featuredMovies = Object.entries(moviesData).slice(0, 4);

  const features = [
    { icon: <Film className="w-6 h-6" />, label: "Cine V.O.S.E" },
    { icon: <Star className="w-6 h-6" />, label: "Salas premium" },
    { icon: <Armchair className="w-6 h-6" />, label: "Butacas amplias" },
    { icon: <Palette className="w-6 h-6" />, label: "Diseño Cyberpunk" },
    { icon: <Car className="w-6 h-6" />, label: "Parking Gratuito" },
    { icon: <Volume2 className="w-6 h-6" />, label: "Dolby ATMOS" },
  ];

  return (
    <div className="bg-black text-white font-sans">
      {/* HERO PRINCIPAL */}
      <section
        className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://rubik-audiovisual.com/wp-content/uploads/2024/07/Cinesa_sala-XL-copia.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-widest text-blue-400 uppercase">
            Bienvenido a CineReact
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 font-light text-gray-200">
            Vive el cine con estrenos exclusivos, experiencias premium y la mejor selección de películas.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/films"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
            >
              Ver Cartelera
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white shadow-lg transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="min-h-screen px-6 md:px-12 flex flex-col items-center justify-center bg-zinc-900 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-300 mb-10">
          ¿Qué nos hace únicos?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mb-3 shadow-md">
                {item.icon}
              </div>
              <p className="text-white font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="min-h-screen px-6 md:px-12 flex flex-col items-center justify-center bg-gradient-to-r from-blue-700 to-blue-900 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Reserva tu próxima película
        </h2>
        <p className="text-gray-200 max-w-xl mx-auto mb-6">
          No te pierdas los mejores estrenos. Reserva tu entrada y vive una experiencia única.
        </p>
        <Link
          to="/films"
          className="px-8 py-3 bg-black border border-white hover:bg-blue-600 hover:border-blue-600 text-white uppercase font-semibold transition"
        >
          Explorar Cartelera
        </Link>
      </section>

      {/* PELÍCULAS DESTACADAS */}
      <section className="min-h-screen px-6 md:px-12 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-blue-300 mb-6 border-b border-blue-500/30 pb-2">
          Películas Destacadas
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredMovies.map(([title, data]) => (
            <div
              key={title}
              className="group bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/30 transition"
            >
              <img
                src={data.image}
                alt={title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-200">{title}</h3>
                <p className="text-sm text-gray-400">{data.genre}</p>
                <button
                  onClick={() => navigate(`/movie/${encodeURIComponent(title)}`)}
                  className="mt-3 inline-block text-sm text-blue-400 hover:text-white border border-blue-400 px-4 py-1 rounded-md transition"
                >
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
