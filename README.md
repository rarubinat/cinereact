# 🎟️ Movie Seat Booking App

A sleek, responsive **React-based cinema booking system** that allows users to select and reserve seats in real-time. It highlights seat availability visually and prevents double bookings by syncing data with the selected movie and showtime.

---

## 🧪 Tech Stack
- React 18
- TailwindCSS (UI styling)
- Firebase (Auth & Firestore)
- React Icons for UI icons
- Jest / Vitest + React Testing Library for testing


## 🚀 Features

- ✅ **Real-time seat availability** per movie & time
- 🎨 Visual seat states (Selected, Occupied, Available)
- 🎥 Multiple movies & schedules support
- 📱 Fully responsive UI with modern styling (TailwindCSS)
- 🎟 Ticket QR code generation
- 🍿 Snack/food ordering integration
- 💳 Secure payments

## 🧩 Core Concept

The app follows a multi-step booking flow managed through a global BookingContext:

- Date/Time selection
- Seat selection
- Snacks selection
- Payment
- Confirmation

A responsive ProgressBar visually guides users through each step, ensuring clarity and consistency across the booking journey.

- 👤 Profile management:
  - Edit personal info (name, phone, birthdate, gender)
  - Toggle notifications & preferred language
  - Displays next reservation, total reservations, and loyalty points

- 🏆 Loyalty system:
  - Earn 20 points per active reservation
  - Membership plan: Silver (default) → Gold (>250 points) → Platinium (>1200 points)
  - Offers & discounts applied dynamically based on selection
  - Firebase Authentication & Firestore integration


## 📂 Project Structure

```bash
src/
│
├── components/
│   ├── auth/               
│   ├── cinema/              
│   ├── hooks/               
│   ├── payment/             
│   ├── profile/            
│   ├── pages/                         
│   └── styles/      
│
├── context/
│   ├── NotificationContext.js
│   └── ProgressBar.js
│
├── data/
│   ├── moviesData.js
│   ├── foodData.js
│   ├── promotionsData.js
│   └── fidelityData.js
│
├── utils/
│   ├── firebase.js
│   └── priceCalculator.js   
│
├── tests/                  
│
├── App.js
└── index.js
```


## 🧪 Testing

- ✅ Unit tests for hooks (useBooking, useReservationCount)
- ✅ Component tests for booking flow (SeatMatrix, ApplyOffers, PriceCalculator)
- ✅ Mocked Firebase integration (no real API calls)

---

## 📦 Installation & Usage

```bash
# Install dependencies
yarn install
#Install TailwindCSS and PostCSS
yarn add -D tailwindcss@3.3.5 postcss autoprefixer
#install ReactIcons
yarn install react-icons
# Start development server
yarn start
# App runs at http://localhost:3000

# Build for production
yarn build

```

## ☁️ Deployment
```bash
# Initialize Firebase hosting (one time setup)
firebase init hosting

# Build the app
yarn build

# Deploy to Firebase
firebase deploy

# Without/functions deploy
firebase deploy --only hosting

```

## 📅 Update History

**2025-10-07**: Implementation of unit and integration tests with Jest/Vitest. Refactoring of components and hooks to improve maintainability.

**2025-09-23**: Logic notifications in-app.

**2025-09-01**: Alerts and confirmations.

**2025-08-25**: Snacks section.

**2025-08-15**: Payment method.

**2025-08-14**: New layout!

**2025-08-01**: Added support for categorizing purchased tickets into Upcoming Events and Past Events for better user experience.

**2025-07-25**: Login and Registration Modal integration.

**2025-07-10**: Improve overall CSS, integrate folder structure for ongoing app development, pre-release login/register, and user integration.


**2025-07-09**: Integrated a dynamic date selector that updates in real-time, filtering available movies and showtimes by day—mirroring the booking functionality of a real cinema for a more accurate and user-friendly experience.

**2025-07-07**: Redesigned UI with dark theme, responsive reservation cards, elegant buttons, consistent styling, and added footer for cinema app.

**2025-06-24**: Real-time validation of reserved seats now based on selected movie and time. Occupied seats shown in red and are unselectable.

## 📄 License
This project is © 2025 [rarubinat](https://github.com/rarubinat)
