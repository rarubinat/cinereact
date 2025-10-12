import React, { useState } from "react";
import MovieDetails from "./MovieDetails";       // Selección de película y fecha
import ReserveSeats from "./ReserveSeats";       // Selección de asientos y fila
import SnacksPage from "./SnacksPage";           // Selección de snacks y bebidas
import Payment from "./Payment";                 // Página de pago
import Confirmation from "./Confirmation";       // Confirmación final
import ProgressBar from "./ProgressBar";        // Tu componente ProgressBar
import { useReservation } from "../../context/ReservationContext";

const UserBooking = () => {
  const { selectedMovie, selectedDate, selectedTime, selectedSeats } = useReservation();

  // 0: MovieDetails, 1: ReserveSeats, 2: SnacksPage, 3: Payment, 4: Confirmation
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const stepsLabels = ["Time", "Seats", "Snacks", "Payment", "Confirmation"];

  // Render dinámico según paso actual
  const renderStep = () => {
    switch (step) {
      case 0:
        return <MovieDetails onNext={nextStep} />;
      case 1:
        return <ReserveSeats onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <SnacksPage onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Payment onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Confirmation />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      {/* Barra de progreso */}
      <ProgressBar currentStep={stepsLabels[step]} />

      {/* Contenido del paso actual */}
      {renderStep()}
    </div>
  );
};

export default UserBooking;
