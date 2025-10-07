import React, { useState } from "react";
import moviesData from "../../data/moviesData";
import { useNavigate } from "react-router-dom";
import {
  Popcorn,
  Film,
  Headphones,
  CreditCard,
  Star,
  Users,
  Gift,
  Trophy,
  Briefcase,
  Coins,
} from "lucide-react";

// Main home page component
const Home = () => {
  const navigate = useNavigate();

  // Filter movies currently playing from moviesData
  const nowPlaying = Object.entries(moviesData).filter(
    ([, data]) => data.category === "NOW_SHOWING"
  );

  // State for future carousel functionality (optional)
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = 4;
  const maxIndex = nowPlaying.length - slidesToShow;

  // Navigate to movie detail page when a movie card is clicked
  const handleNavigate = (title) => {
    navigate(`/movie/${encodeURIComponent(title)}`);
  };

  return (
    <div className="bg-white text-black font-sans">
      <main>

        {/* ============================ HERO SECTION ============================ */}
        {/* Main header banner with background image and call-to-action button */}
        <section
          className="relative w-full h-screen flex items-center justify-center text-center text-white"
          style={{
            backgroundImage:
              "url('https://madrid365.es/wp-content/uploads/2023/04/1-2023-04-12T122852.570.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay to enhance text readability */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Hero content (title, description, button) */}
          <div className="relative z-10 px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Live the cinema experience <br /> like never before
            </h1>
            <p className="mb-6 text-lg md:text-xl text-gray-200">
              Always updated movie listings, premium auditoriums and a loyalty
              program designed for you and your company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#memberships"
                className="border border-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black"
              >
                Join Cinema Club
              </a>
            </div>
          </div>

          {/* Gradient at the bottom for smooth transition to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-slate-900"></div>
        </section>

        {/* ============================ NOW PLAYING SECTION ============================ */}
        {/* Displays currently playing movies from moviesData */}
        <section className="pb-16 bg-slate-900 text-white">
          <h2 className="text-3xl font-bold mb-6 px-6 md:px-12">Now Playing</h2>

          {/* Movie grid (responsive layout for 2 to 4 columns) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-12">
            {nowPlaying.map(([title, data]) => (
              <div
                key={title}
                className="relative rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => handleNavigate(title)} // Navigate on click
              >
                <img
                  src={data.image}
                  alt={title}
                  className="w-full h-40 md:h-48 object-cover"
                />
                {/* Overlay title at the bottom of each movie card */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-3">
                  <p className="text-sm font-semibold">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================ BENEFITS & SERVICES ============================ */}
        {/* Informational cards describing what makes the cinema unique */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Benefits & Services
          </h2>

          {/* Two-column grid of feature cards (responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Each card shows an icon, title, and descriptive text */}
            <article className="p-12 text-center border rounded-2xl shadow-md hover:shadow-lg transition bg-white">
              <Popcorn className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Gourmet Snacks</h4>
              <p className="text-gray-600 text-base mb-3">
                Exclusive recipes and healthy options designed for every taste.
              </p>
              <p className="text-gray-500 text-sm">
                From artisanal popcorn to vegan-friendly snacks, enjoy a
                gastronomic experience beyond the screen.
              </p>
            </article>

            <article className="p-12 text-center border rounded-2xl shadow-md hover:shadow-lg transition bg-white">
              <Film className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Premium Auditoriums</h4>
              <p className="text-gray-600 text-base mb-3">
                Reclining leather seats, extra legroom and laser projection.
              </p>
              <p className="text-gray-500 text-sm">
                Every detail is designed for maximum comfort so you can enjoy
                movies the way they were meant to be seen.
              </p>
            </article>

            <article className="p-12 text-center border rounded-2xl shadow-md hover:shadow-lg transition bg-white">
              <Headphones className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Dolby Atmos</h4>
              <p className="text-gray-600 text-base mb-3">
                Cutting-edge immersive sound that surrounds you.
              </p>
              <p className="text-gray-500 text-sm">
                Feel the planes fly above your head and whispers move across
                the room — sound as alive as the image.
              </p>
            </article>

            <article className="p-12 text-center border rounded-2xl shadow-md hover:shadow-lg transition bg-white">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Cinema Club</h4>
              <p className="text-gray-600 text-base mb-3">
                Points, rewards and exclusive presales for members.
              </p>
              <p className="text-gray-500 text-sm">
                Access special events, premieres before anyone else and unique
                promotions just for our loyalty members.
              </p>
            </article>
          </div>
        </section>

        {/* ============================ HERO SNACKS ============================ */}
        {/* Promotional banner highlighting snacks */}
        <section
          className="relative w-full h-[60vh] flex items-center justify-center text-center text-white"
          style={{
            backgroundImage:
              "url('https://www.good.is/media-library/cover-image-source-popcorn-on-a-tray-pictured-on-a-vendors-tray-photo-by-stu-forster.jpg?id=55297231&width=1245&height=700&coordinates=40%2C0%2C40%2C0')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 px-6 max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold mb-4">Snack & Enjoy</h2>
            <p className="text-lg text-gray-100">
              Treat yourself with our gourmet popcorn and snacks while enjoying
              your favorite movies in premium comfort.
            </p>
          </div>
          {/* Soft gradient transition to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-gray-50"></div>
        </section>

        {/* ============================ LOYALTY PROGRAM ============================ */}
        {/* Explains the rewards and benefits for loyal customers */}
        <section id="memberships" className="py-16 bg-gray-50 px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Cinema Loyalty Program
          </h2>
          <p className="text-center max-w-2xl mx-auto text-gray-700 mb-12">
            Earn points every time you enjoy a movie with us. Redeem them for
            free tickets, snacks or unlock exclusive benefits. Our program is
            designed with flexible tiers for both frequent moviegoers and
            companies.
          </p>

          {/* Grid with 4 loyalty program benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-12">
            <div className="bg-white border rounded-2xl p-12 text-center shadow-md hover:shadow-lg transition">
              <Coins className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Earn Points</h4>
              <p className="text-gray-600 text-base mb-3">
                Collect points with every purchase.
              </p>
              <p className="text-gray-500 text-sm">
                Tickets, popcorn, drinks — everything adds up to help you reach
                higher rewards faster.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-12 text-center shadow-md hover:shadow-lg transition">
              <Gift className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Redeem Rewards</h4>
              <p className="text-gray-600 text-base mb-3">
                Exchange points for exclusive prizes.
              </p>
              <p className="text-gray-500 text-sm">
                Free tickets, popcorn combos, soft drinks, or private screenings.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-12 text-center shadow-md hover:shadow-lg transition">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Exclusive Tiers</h4>
              <p className="text-gray-600 text-base mb-3">
                Unlock Silver, Gold and Platinum levels.
              </p>
              <p className="text-gray-500 text-sm">
                Discounts, VIP lounges, and priority booking for our top clients.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-12 text-center shadow-md hover:shadow-lg transition">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-black" />
              <h4 className="font-semibold text-xl mb-3">Corporate Benefits</h4>
              <p className="text-gray-600 text-base mb-3">
                Tailored plans for companies and groups.
              </p>
              <p className="text-gray-500 text-sm">
                Exclusive discounts and benefits for corporate clients.
              </p>
            </div>
          </div>
        </section>

        {/* ============================ HERO AUDITORIUMS ============================ */}
        {/* Another promotional section for cinema rooms */}
        <section
          className="relative w-full h-[60vh] flex items-center justify-center text-center text-white"
          style={{
            backgroundImage:
              "url('https://studios.aalto.fi/wp-content/uploads/2024/09/CINEMA-3-2048x1365.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 px-6 max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold mb-4">Premium Auditoriums</h2>
            <p className="text-lg text-gray-100">
              Experience our cutting-edge auditoriums with crystal-clear image
              quality and immersive sound.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-slate-900"></div>
        </section>

        {/* ============================ TESTIMONIALS ============================ */}
        {/* Customer feedback section */}
        <section className="py-16 px-6 md:px-12 bg-slate-900 text-white">
          <h2 className="text-3xl font-bold mb-10 text-center">
            What our customers say
          </h2>

          {/* Grid with 3 testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 border border-white/20 rounded-lg shadow-sm bg-slate-800">
              <Star className="w-6 h-6 text-white mb-3" />
              <p className="mb-4">
                "An amazing experience, premium rooms are the best."
              </p>
              <p className="font-semibold">Laura G.</p>
            </div>

            <div className="p-6 border border-white/20 rounded-lg shadow-sm bg-slate-800">
              <Users className="w-6 h-6 text-white mb-3" />
              <p className="mb-4">
                "Perfect to go out with friends, the loyalty program is very useful."
              </p>
              <p className="font-semibold">Carlos M.</p>
            </div>

            <div className="p-6 border border-white/20 rounded-lg shadow-sm bg-slate-800">
              <Film className="w-6 h-6 text-white mb-3" />
              <p className="mb-4">"Definitely the best cinema in town."</p>
              <p className="font-semibold">Ana P.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
