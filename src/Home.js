import { useNavigate } from "react-router-dom";  // <-- Importa useNavigate
import moviesData from "./data/moviesData";

const MovieCard = ({ title, data }) => {
  const navigate = useNavigate();

  const handleVerMas = () => {
    navigate(`/movie/${encodeURIComponent(title)}`); // Navega con el título codificado
  };

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/30 transition duration-300">
      <img
        src={data.image}
        alt={title}
        className="w-full h-72 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-blue-300">{title}</h3>
        <p className="text-sm text-zinc-400 truncate">{data.genre}</p>
        <p className="text-xs text-zinc-500">{data.duration} min</p>
        <button
          onClick={handleVerMas}
          className="mt-2 text-sm text-blue-400 hover:text-white border border-blue-400 px-3 py-1 rounded-md transition"
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 md:px-12 py-10">
      <h1 className="text-3xl font-light text-blue-200 border-b border-blue-500/20 mb-8 pb-2">
        Cartelera
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Object.entries(moviesData).map(([title, data]) => (
          <MovieCard key={title} title={title} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Home;
