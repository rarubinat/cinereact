import { useState } from "react";
import { useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";

const MovieCard = ({ title, data }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    navigate(`/movie/${encodeURIComponent(title)}`);
  };

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/30 transition duration-300 flex flex-col h-full">
      <img
        src={data.image}
        alt={title}
        className="w-full h-72 object-cover"
      />

      <div className="p-4 space-y-2 flex-grow">
        <h3 className="text-lg font-semibold text-blue-300">{title}</h3>
        <p className="text-sm text-zinc-400 truncate">{data.genre}</p>
        <p className="text-xs text-zinc-500">{data.duration} min</p>
      </div>

      {data.category !== "COMING_SOON" && (
        <button
          onClick={handleSeeMore}
          className="w-full py-2 text-sm font-medium text-blue-400 hover:text-white border-t border-blue-500/30 bg-zinc-800 hover:bg-blue-600 transition"
        >
          See More
        </button>
      )}
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
    <div className="min-h-screen bg-zinc-950 text-white px-6 md:px-12 py-10">
      <h3 className="text-3xl font-light text-blue-200 border-b border-blue-500/20 mb-6 pb-2">
        Films
      </h3>

      {/* Categorías */}
      <div className="flex gap-3 mb-8">
        {["NOW_SHOWING", "COMING_SOON"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-sm font-semibold border transition duration-200 rounded-md
              ${
                filter === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30"
                  : "bg-zinc-800 text-blue-300 border-blue-500/30 hover:bg-blue-500/20"
              }`}
          >
            {cat === "NOW_SHOWING" ? "Now Showing" : "Coming Soon"}
          </button>
        ))}
      </div>

      {/* Grid de películas */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredMovies.map(([title, data]) => (
          <MovieCard key={title} title={title} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Films;
