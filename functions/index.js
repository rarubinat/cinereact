const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendConfirmationEmail = functions.firestore
  .document("reservas/{reservaId}")
  .onCreate(async (snap, context) => {
    const reserva = snap.data();

    if (!reserva.email) {
      console.log("No email found in reservation");
      return null;
    }

    const msg = {
      to: reserva.email,
      from: "tu-correo-verificado@sendgrid.com", // Cambia esto por el que verificaste en SendGrid
      subject: "Confirmación de tu reserva en CINEREACT",
      text: `Has reservado ${reserva.selectedSeats.length} asientos para ${reserva.selectedMovie} el ${reserva.selectedDate} a las ${reserva.selectedTime}.`,
      html: `
        <h1>¡Reserva confirmada!</h1>
        <p><strong>Pelicula:</strong> ${reserva.selectedMovie}</p>
        <p><strong>Fecha:</strong> ${reserva.selectedDate}</p>
        <p><strong>Hora:</strong> ${reserva.selectedTime}</p>
        <p><strong>Asientos:</strong> ${reserva.selectedSeats.join(", ")}</p>
        <p><strong>Total:</strong> ${reserva.totalPrice.toFixed(2)} €</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`Correo enviado a: ${reserva.email}`);
    } catch (error) {
      console.error("Error enviando correo:", error);
    }

    return null;
  });
