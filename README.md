# 🎟️ Movie Seat Booking App

A sleek, responsive **React-based cinema booking system** that allows users to select and reserve seats in real-time. It highlights seat availability visually and prevents double bookings by syncing data with the selected movie and showtime.

---

## 🧪 Tech Stack
- Frontend: React (with Hooks)

- Styling: CSS / Custom styles (or Tailwind, styled-components if added)

- Deployment: Firebase Hosting

## 🚀 Features

- ✅ **Real-time seat availability** per movie & time
- 🎨 Visual seat states:
  - 🟦 Selected (blue)
  - 🟥 Occupied (red)
  - ⬜ Available (grey)
- 🎥 **Multiple movies & showtimes** support
- 📱 Fully **responsive** UI with modern styling

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
```

## 📅 Update History

**2025-07-25**: Login and Registration Modal integration.

**2025-07-10**: Improve overall CSS, integrate folder structure for ongoing app development, pre-release login/register, and user integration.


**2025-07-09**: Integrated a dynamic date selector that updates in real-time, filtering available movies and showtimes by day—mirroring the booking functionality of a real cinema for a more accurate and user-friendly experience.

**2025-07-07**: Redesigned UI with dark theme, responsive reservation cards, elegant buttons, consistent styling, and added footer for cinema app.

**2025-06-24**: Real-time validation of reserved seats now based on selected movie and time. Occupied seats shown in red and are unselectable.

## 📄 License
This project is licensed under the MIT License.
© 2025 [rarubinat](https://github.com/rarubinat)
