import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Star, Armchair, Palette, Car, Volume2 } from "lucide-react";
import moviesData from "../data/moviesData";

const Home = () => {
  const navigate = useNavigate();
  const featuredMovies = Object.entries(moviesData).slice(0, 4);

  return (
    <div className="bg-[#FAF9F6] text-black font-sans">
      
      {/* HERO CON BACKGROUND */}
      <section
        className="relative min-h-[70vh] w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://rubik-audiovisual.com/wp-content/uploads/2024/07/Cinesa_sala-XL-copia.jpg')",
        }}
      >
        {/* Overlay suave para que el texto sea legible */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow">
            Welcome to CineReact
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 text-gray-100">
            Experience cinema with exclusive premieres, premium experiences, and the best movie selection.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/films"
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:opacity-90 transition"
            >
              View Movies
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:opacity-90 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 md:px-16 lg:px-24 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Discover CineReact</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
          CineReact is not just a cinema, it's a cinematic experience from another dimension.
          Designed with cutting-edge technology and a futuristic atmosphere, every screening becomes an immersive journey.
        </p>
        <Link
          to="/about"
          className="px-6 py-3 bg-black text-white rounded-full font-medium hover:opacity-90 transition"
        >
          Learn More
        </Link>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-16 lg:px-24 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Why Choose CineReact?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: <Film className="w-6 h-6" />, label: "Original Version Cinema", description: "Premieres in V.O.S.E. so you can enjoy every detail as intended by its creators." },
            { icon: <Star className="w-6 h-6" />, label: "Premium Theaters", description: "4K laser projection, giant screens, and architecture designed for maximum immersion." },
            { icon: <Armchair className="w-6 h-6" />, label: "Reclining Seats", description: "Ergonomic chairs with more space and comfort, as if you were in first class." },
            { icon: <Palette className="w-6 h-6" />, label: "Cyberpunk Design", description: "Futuristic environments with LED lights and aesthetics inspired by the Cyberpunk universe." },
            { icon: <Car className="w-6 h-6" />, label: "Free Parking", description: "Private, free, and secured parking for a more convenient experience." },
            { icon: <Volume2 className="w-6 h-6" />, label: "Dolby ATMOS", description: "360° immersive sound with unmatched precision that pulls you into every scene." },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 text-black">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 md:px-12 py-20 text-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">Book Your Next Movie</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Don’t miss the hottest premieres. Book your ticket and enjoy a unique experience.
        </p>
        <Link
          to="/films"
          className="px-6 py-3 bg-black text-white rounded-full font-medium hover:opacity-90 transition"
        >
          Explore Movies
        </Link>
      </section>

      {/* FEATURED MOVIES */}
      <section className="px-6 md:px-12 py-16">
        <h2 className="text-2xl font-bold mb-6">Now Playing</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredMovies.map(([title, data], index) => (
            <div
              key={title}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <img
                src={data.image}
                alt={title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">{data.genre}</p>
                <button
                  onClick={() => navigate(`/movie/${encodeURIComponent(title)}`)}
                  className="mt-3 block w-full bg-black text-white py-2 rounded-full hover:opacity-90 transition"
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90">
            View Showtimes
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
