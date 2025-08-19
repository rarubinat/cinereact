import React, { useState } from "react";
import moviesData from "../data/moviesData";
import { useNavigate } from "react-router-dom";
import {
  Popcorn,
  Film,
  Headphones,
  CreditCard,
  Star,
  Users,
  Newspaper,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const nowPlaying = Object.entries(moviesData).filter(
    ([, data]) => data.category === "NOW_SHOWING"
  );
  const comingSoon = Object.entries(moviesData).filter(
    ([, data]) => data.category === "COMING_SOON"
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = 4;
  const maxIndex = nowPlaying.length - slidesToShow;

  const next = () =>
    setCurrentIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
  const prev = () =>
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);

  const handleNavigate = (title) => {
    navigate(`/movie/${encodeURIComponent(title)}`);
  };

  return (
    <div className="bg-white text-black font-sans">
      <main className="container mx-auto px-6 md:px-12">

        {/* HERO */}
        <section className="hero py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              Live the cinema experience <br /> like never before
            </h1>
            <p className="mb-6 text-lg text-gray-600 max-w-xl">
              Always updated movie listings, premium auditoriums and a loyalty
              program designed for you and your company.
            </p>
            <div className="flex gap-4">
              <a
                href="#showtimes"
                className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-80"
              >
                Buy Tickets
              </a>
              <a
                href="#memberships"
                className="border border-black px-6 py-3 rounded-full font-medium hover:bg-black hover:text-white"
              >
                Join Cinema Club
              </a>
            </div>
          </div>
          <div className="poster-hero flex justify-center items-center">
            <Film size={160} strokeWidth={1} className="text-gray-800" />
          </div>
        </section>

        {/* NOW PLAYING */}
        <section id="now-playing" className="py-12">
          <h2 className="text-3xl font-bold mb-6">Now Playing</h2>
          <div className="relative">
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full z-10 hover:opacity-80"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full z-10 hover:opacity-80"
            >
              ›
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(-${
                    (100 / slidesToShow) * currentIndex
                  }%)`,
                }}
              >
                {nowPlaying.map(([title, data]) => (
                  <div
                    key={title}
                    className="flex-shrink-0 w-1/4 px-2 cursor-pointer"
                    onClick={() => handleNavigate(title)}
                  >
                    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg border border-gray-200 transition">
                      <img
                        src={data.image}
                        alt={title}
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="cta-center mt-6 text-center" id="showtimes">
            <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:opacity-90">
              View Showtimes
            </button>
          </div>
        </section>

        {/* COMING SOON */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {comingSoon.map(([title, data]) => (
              <div
                key={title}
                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="h-60">
                  <img
                    src={data.image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-gray-500 text-sm">{data.releaseDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6">Benefits & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <article className="p-6 text-center border rounded-lg hover:shadow-md">
              <Popcorn className="w-10 h-10 mx-auto mb-3 text-black" />
              <h4 className="font-semibold">Gourmet Snacks</h4>
              <p className="text-gray-600 text-sm">
                Exclusive recipes and healthy options.
              </p>
            </article>
            <article className="p-6 text-center border rounded-lg hover:shadow-md">
              <Film className="w-10 h-10 mx-auto mb-3 text-black" />
              <h4 className="font-semibold">Premium Auditoriums</h4>
              <p className="text-gray-600 text-sm">
                Reclining seats and laser projection.
              </p>
            </article>
            <article className="p-6 text-center border rounded-lg hover:shadow-md">
              <Headphones className="w-10 h-10 mx-auto mb-3 text-black" />
              <h4 className="font-semibold">Dolby Atmos</h4>
              <p className="text-gray-600 text-sm">
                Next-generation immersive sound.
              </p>
            </article>
            <article className="p-6 text-center border rounded-lg hover:shadow-md">
              <CreditCard className="w-10 h-10 mx-auto mb-3 text-black" />
              <h4 className="font-semibold">Cinema Club</h4>
              <p className="text-gray-600 text-sm">
                Points, rewards and exclusive presales.
              </p>
            </article>
          </div>
        </section>

        {/* MEMBERSHIPS */}
        <section id="memberships" className="py-12">
          <h2 className="text-3xl font-bold mb-6">Memberships</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg text-center hover:shadow-md">
              <h3 className="font-bold text-xl mb-2">Basic</h3>
              <p className="text-gray-600 mb-4">Standard access to benefits</p>
              <p className="text-2xl font-bold mb-4">$9.99/month</p>
              <button className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90">
                Subscribe
              </button>
            </div>
            <div className="p-6 border rounded-lg text-center shadow-lg border-black">
              <h3 className="font-bold text-xl mb-2">Premium</h3>
              <p className="text-gray-600 mb-4">
                Unlimited tickets and early access
              </p>
              <p className="text-2xl font-bold mb-4">$19.99/month</p>
              <button className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90">
                Subscribe
              </button>
            </div>
            <div className="p-6 border rounded-lg text-center hover:shadow-md">
              <h3 className="font-bold text-xl mb-2">Corporate</h3>
              <p className="text-gray-600 mb-4">
                Exclusive benefits for companies
              </p>
              <p className="text-2xl font-bold mb-4">Contact us</p>
              <button className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90">
                Contact
              </button>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6">What our customers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg shadow-sm">
              <Star className="w-6 h-6 text-black mb-3" />
              <p className="text-gray-600 mb-4">
                "An amazing experience, premium rooms are the best."
              </p>
              <p className="font-semibold">Laura G.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <Users className="w-6 h-6 text-black mb-3" />
              <p className="text-gray-600 mb-4">
                "Perfect to go out with friends, the loyalty program is very useful."
              </p>
              <p className="font-semibold">Carlos M.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <Film className="w-6 h-6 text-black mb-3" />
              <p className="text-gray-600 mb-4">
                "Definitely the best cinema in town."
              </p>
              <p className="font-semibold">Ana P.</p>
            </div>
          </div>
        </section>

        {/* NEWS */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6">News & Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg hover:shadow-md">
              <Newspaper className="w-8 h-8 text-black mb-3" />
              <h3 className="font-semibold mb-2">New IMAX Auditorium</h3>
              <p className="text-gray-600 text-sm">
                We inaugurated a new IMAX room with laser projection technology.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-md">
              <Newspaper className="w-8 h-8 text-black mb-3" />
              <h3 className="font-semibold mb-2">Corporate Partnership</h3>
              <p className="text-gray-600 text-sm">
                Exclusive discounts for affiliated companies.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-md">
              <Newspaper className="w-8 h-8 text-black mb-3" />
              <h3 className="font-semibold mb-2">Film Festival</h3>
              <p className="text-gray-600 text-sm">
                Our annual festival with exclusive premieres is coming soon.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
