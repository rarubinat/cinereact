// Films.js
// Component to display a list of movies with filtering and clickable movie cards

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";

/**
 * Helper function to format a date string from YYYY-MM-DD -> DD-MM-YYYY
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Date in DD-MM-YYYY format
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

/**
 * MovieCard Component
 * Represents a single movie card with poster, title, genre, and duration.
 * Cards for "COMING_SOON" movies are not clickable.
 */
const MovieCard = ({ title, data }) => {
  const navigate = useNavigate();

  // Navigate to movie details page if the movie is currently showing
  const handleSeeMore = () => {
    if (data.category !== "COMING_SOON") {
      navigate(`/movie/${encodeURIComponent(title)}`);
    }
  };

  return (
    <div
      onClick={handleSeeMore}
      className={`bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition
        flex w-full h-36 md:h-auto md:flex-col relative
        ${data.category !== "COMING_SOON" ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Movie poster */}
      <img
        src={data.image}
        alt={title}
        className="w-24 h-full object-cover md:w-full md:h-72"
      />

      {/* Movie information */}
      <div className="flex flex-col justify-center px-3 py-2 md:p-4 flex-grow">
        <h3 className="text-sm font-semibold text-black md:text-lg">{title}</h3>

        {/* Show genre and duration if now showing, otherwise display release date */}
        {data.category !== "COMING_SOON" ? (
          <>
            <p className="text-xs text-gray-600 truncate md:text-sm">{data.genre}</p>
            <p className="text-xs text-gray-500 md:text-xs">{data.duration} min</p>
          </>
        ) : (
          <div className="mt-2">
            <p className="text-xs font-bold uppercase text-gray-700">
              Coming Soon on {formatDate(data.releaseDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Films Component
 * Displays all movies with a filter for "Now Showing" and "Coming Soon".
 * Uses responsive layout: flex column on mobile, grid on desktop.
 */
const Films = () => {
  // State to manage selected filter (NOW_SHOWING / COMING_SOON)
  const [filter, setFilter] = useState("NOW_SHOWING");

  // Filter movies based on selected category
  const filteredMovies = Object.entries(moviesData).filter(([_, data]) => {
    if (filter === "NOW_SHOWING") return data.category !== "COMING_SOON";
    return data.category === filter;
  });

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-6 md:px-12 py-10">
      {/* Page title */}
      <h3 className="text-3xl font-bold text-black mb-6">Films</h3>

      {/* Filter buttons */}
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
            {cat === "NOW_SHOWING" ? "Now Showing" : "Coming Soon"}
          </button>
        ))}
      </div>

      {/* Movie list: stacked on mobile, grid on desktop */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-6">
        {filteredMovies.map(([title, data]) => (
          <MovieCard key={title} title={title} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Films;
