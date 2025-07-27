import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Star, Armchair, Palette, Car, Volume2 } from "lucide-react";
import moviesData from "../data/moviesData";

const Home = () => {
  const navigate = useNavigate();
  const featuredMovies = Object.entries(moviesData).slice(0, 4);

  return (
    <div className="bg-black text-white font-sans">
      {/* MAIN HERO */}
      <section
        className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://rubik-audiovisual.com/wp-content/uploads/2024/07/Cinesa_sala-XL-copia.jpg')",
          clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center max-w-3xl px-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-widest text-[#005BAC] uppercase drop-shadow-lg">
            Welcome to CineReact
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 font-light text-gray-200">
            Experience cinema with exclusive premieres, premium experiences, and the best movie selection.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/films"
              className="px-8 py-3 bg-[#005BAC] hover:bg-[#004080] text-white shadow-lg transition-transform transform hover:scale-105"
            >
              View Movies
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white shadow-lg transition-transform transform hover:scale-105"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT THE CINEMA SECTION */}
      <section
        className="w-full px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-zinc-900 to-black text-center"
        style={{
          clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0 95%)",
        }}
      >
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#005BAC] mb-6 tracking-wide">
            Discover CineReact
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            CineReact is not just a cinema, it's a cinematic experience from another dimension. 
            Designed with cutting-edge technology and a futuristic atmosphere, every screening becomes an immersive journey 
            that awakens your emotions. From our 4K screens and Dolby ATMOS sound to the 
            cyberpunk aesthetics of our rooms, everything is designed for you to live cinema like never before.
          </p>
          <Link
            to="/about"
            className="px-8 py-3 bg-[#005BAC] hover:bg-[#004080] text-white font-semibold rounded-md transition-transform transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="w-full min-h-screen px-6 md:px-16 lg:px-24 py-20 bg-zinc-900 text-center"
        style={{
          clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0 95%)",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#005BAC] mb-16 tracking-wide animate-fade-in">
          Why Choose CineReact?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {[
            {
              icon: <Film className="w-8 h-8" />,
              label: "Original Version Cinema",
              description:
                "Premieres in V.O.S.E. so you can enjoy every detail as intended by its creators.",
            },
            {
              icon: <Star className="w-8 h-8" />,
              label: "Premium Theaters",
              description:
                "4K laser projection, giant screens, and architecture designed for maximum immersion.",
            },
            {
              icon: <Armchair className="w-8 h-8" />,
              label: "Reclining Seats",
              description:
                "Ergonomic chairs with more space and comfort, as if you were in first class.",
            },
            {
              icon: <Palette className="w-8 h-8" />,
              label: "Cyberpunk Design",
              description:
                "Futuristic environments with LED lights and aesthetics inspired by the Cyberpunk universe.",
            },
            {
              icon: <Car className="w-8 h-8" />,
              label: "Free Parking",
              description:
                "Private, free, and secured parking for a more convenient experience.",
            },
            {
              icon: <Volume2 className="w-8 h-8" />,
              label: "Dolby ATMOS",
              description:
                "360° immersive sound with unmatched precision that pulls you into every scene.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-8 rounded-xl shadow-lg border border-[#005BAC]/30 
              hover:scale-105 hover:shadow-[#005BAC]/40 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#005BAC]/10 text-[#005BAC] flex items-center justify-center mb-5 shadow-md">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#8FCFFF] mb-3">{item.label}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="w-full min-h-screen px-6 md:px-12 flex flex-col items-center justify-center bg-gradient-to-r from-[#004080] to-[#005BAC] text-center"
        style={{
          clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0 95%)",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
          Book Your Next Movie
        </h2>
        <p className="text-gray-200 max-w-xl mx-auto mb-6 animate-fade-in">
          Don’t miss the hottest premieres. Book your ticket and enjoy a unique experience.
        </p>
        <Link
          to="/films"
          className="px-8 py-3 bg-black border border-white hover:bg-[#005BAC] hover:border-[#005BAC] text-white uppercase font-semibold transition-transform transform hover:scale-105"
        >
          Explore Movies
        </Link>
      </section>

      {/* FEATURED MOVIES */}
      <section
        className="w-full min-h-screen px-6 md:px-12 flex flex-col justify-center"
        style={{
          clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0 95%)",
        }}
      >
        <h2 className="text-2xl font-semibold text-[#005BAC] mb-6 border-b border-[#005BAC]/30 pb-2 animate-fade-in">
          Featured Movies
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredMovies.map(([title, data], index) => (
            <div
              key={title}
              className="group bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-[#005BAC]/30 
              transition-transform transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <img
                src={data.image}
                alt={title}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#8FCFFF]">{title}</h3>
                <p className="text-sm text-gray-400">{data.genre}</p>
                <button
                  onClick={() => navigate(`/movie/${encodeURIComponent(title)}`)}
                  className="mt-3 inline-block text-sm text-[#005BAC] hover:text-white border border-[#005BAC] px-4 py-1 rounded-md transition-transform transform hover:scale-105"
                >
                  View More
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
