import { useState } from "react";
import { useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";

const MovieCard = ({ title, data }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    navigate(`/movie/${encodeURIComponent(title)}`);
  };

  return (
    <div
      onClick={handleSeeMore}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col h-full"
    >
      <img
        src={data.image}
        alt={title}
        className="w-full h-72 object-cover"
      />

      <div className="p-4 space-y-1 flex-grow">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-sm text-gray-600 truncate">{data.genre}</p>
        <p className="text-xs text-gray-500">{data.duration} min</p>
      </div>
    </div>
  );
};

const Films = () => {
  const [filter, setFilter] = useState("NOW_SHOWING");

  const filteredMovies = Object.entries(moviesData).filter(([_, data]) => {
    if (filter === "NOW_SHOWING") return data.category !== "COMING_SOON";
    return data.category === filter;
  });

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-6 md:px-12 py-10">
      {/* Título */}
      <h3 className="text-3xl font-bold text-black mb-6">
        Films
      </h3>

      {/* Categorías */}
      <div className="flex gap-3 mb-8">
        {["NOW_SHOWING", "COMING_SOON"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition
              ${
                filter === cat
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {cat === "NOW_SHOWING" ? "Now Playing" : "Coming Soon"}
          </button>
        ))}
      </div>

      {/* Grid de películas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredMovies.map(([title, data]) => (
          <MovieCard key={title} title={title} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Films;
