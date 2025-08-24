import React, { useState } from "react";
import { Gift, Percent, Popcorn, Ticket, Film, Trophy } from "lucide-react";
import promotionsData from "../../data/promotionsData";
import db, { auth } from "../../utils/firebase";

const Promotions = () => {
  const { generalPromotions, moviePromotions, contests } = promotionsData;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketId: "",
    sorteoTitle: ""
  });
  const [userTickets, setUserTickets] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [participationType, setParticipationType] = useState("");

  const getIcon = (type) => {
    switch (type) {
      case "general":
        return {
          "2x1 Tuesdays": <Ticket className="w-10 h-10 mx-auto mb-4 text-black" />,
          "Popcorn Combo Deal": <Popcorn className="w-10 h-10 mx-auto mb-4 text-black" />,
          "Student Discount": <Percent className="w-10 h-10 mx-auto mb-4 text-black" />,
          "Birthday Special": <Gift className="w-10 h-10 mx-auto mb-4 text-black" />,
        };
      case "movie":
        return <Film className="w-10 h-10 mx-auto mb-4 text-black" />;
      case "contest":
        return <Trophy className="w-10 h-10 mx-auto mb-4 text-black" />;
      default:
        return null;
    }
  };

  const openParticipationForm = async (title, description, type) => {
    setModalContent({ title, description });
    setParticipationType(type);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ticketId: "",
      sorteoTitle: title
    });
    setError("");
    setSuccess("");

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const snapshot = await db
          .collection("reservas")
          .where("userId", "==", currentUser.uid)
          .get();
        const tickets = snapshot.docs.map((doc) => doc.data().ticketId);
        setUserTickets(tickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    }

    setModalVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("You must be logged in to participate.");
      return;
    }

    if (!userTickets.includes(formData.ticketId)) {
      setError("The ticket ID does not match any of your reservations.");
      return;
    }

    try {
      const existingSnapshot = await db
        .collection("sorteos")
        .where("ticketId", "==", formData.ticketId)
        .get();

      if (!existingSnapshot.empty) {
        setError("This ticket has already been used.");
        return;
      }

      await db.collection("sorteos").add({
        ...formData,
        userId: currentUser.uid,
        type: participationType,
        createdAt: new Date(),
      });

      setSuccess("Participation submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        ticketId: "",
        sorteoTitle: ""
      });

    } catch (err) {
      console.error("Error submitting participation:", err);
      setError("There was an error submitting your participation. Try again later.");
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-12">
      <h1 className="text-3xl font-bold text-black mb-6">Promotions & Contests</h1>

      {/* General Promotions */}
      <h2 className="text-2xl font-bold text-black mb-6">General Promotions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {generalPromotions.map((promo, index) => (
          <div key={index} className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition">
            {getIcon("general")[promo.title]}
            <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">{promo.badge}</span>
            <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
            <p className="text-gray-600 text-sm">{promo.description}</p>
          </div>
        ))}
      </div>

      {/* Movie Promotions */}
      <h2 className="text-2xl font-bold text-black mb-6">Movie Specials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {moviePromotions.map((promo, index) => (
          <div key={index} className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition">
            {getIcon("movie")}
            <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">{promo.badge}</span>
            <h3 className="text-lg font-bold mb-2">{promo.movie}</h3>
            <p className="text-gray-600 text-sm">{promo.description}</p>
            <button
              onClick={() => openParticipationForm(promo.movie, promo.description, "movie")}
              className="mt-4 px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              Participate
            </button>
          </div>
        ))}
      </div>

      {/* Contests */}
      <h2 className="text-2xl font-bold text-black mb-6">Contests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contests.map((contest, index) => (
          <div key={index} className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition">
            {getIcon("contest")}
            <span className="inline-block bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">{contest.badge}</span>
            <h3 className="text-lg font-bold mb-2">{contest.title}</h3>
            <p className="text-gray-600 text-sm">{contest.description}</p>
            <button
              onClick={() => openParticipationForm(contest.title, contest.description, "contest")}
              className="mt-4 px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              Participate
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="
              bg-white rounded-none sm:rounded-2xl 
              p-6 shadow-xl 
              w-full h-full sm:max-w-md sm:h-auto 
              overflow-auto relative
            "
          >
            {/* Botón de cerrar en esquina superior izquierda */}
            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
            >
              &#x2715;
            </button>

            <h2 className="text-xl font-bold text-black mb-4">{modalContent.title}</h2>
            <p className="text-gray-700 mb-6">{modalContent.description}</p>
            <p className="mb-4 text-gray-600">
              Fill the form to participate in the draw. Valid tickets must be purchased online for 
              "Expediente Warren: The Last Rite" or "Marathon Expediente Warren" between Aug 20, 2025 
              and Sep 7, 2025.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!success && (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Raffle</label>
                    <input
                      type="text"
                      name="sorteoTitle"
                      value={formData.sorteoTitle}
                      disabled
                      className="w-full border rounded p-2 bg-gray-100 text-gray-700 cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">First Name*</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border rounded p-2"/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Last Name*</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border rounded p-2"/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Email*</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded p-2"/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Phone (optional)</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2"/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Ticket ID*</label>
                    <input type="text" name="ticketId" value={formData.ticketId} onChange={handleChange} required className="w-full border rounded p-2"/>
                  </div>
                </>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 rounded-full bg-black text-white hover:bg-red-600 transition focus:outline-none"
                >
                  {success ? "Close" : "Cancel"}
                </button>
                {!success && (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-black text-white hover:bg-green-600 transition focus:outline-none"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;