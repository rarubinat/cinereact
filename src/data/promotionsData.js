// src/data/promotionsData.js

const generalPromotions = [
  {
    title: "2x1 Tuesdays",
    description: "Buy one ticket and get the second free every Tuesday.",
    badge: "Weekly",
  },
  {
    title: "Popcorn Combo Deal",
    description: "Get 20% off and enjoy a complimentary popcorn and large drink on weekends!",
    badge: "Weekend",
  },
  {
    title: "Student Discount",
    description: "15% off with valid student ID, all week long.",
    badge: "Always",
  },
  {
    title: "Birthday Special",
    description: "Enjoy a free ticket on your birthday! Celebrate with us.",
    badge: "Special",
  },
];

const moviePromotions = [
  {
    movie: "Deadpool & Wolverine",
    description:
      "Buy your ticket and enter to win exclusive passes to the red carpet premiere.",
    badge: "Premiere",
  },
  {
    movie: "28 Years Later",
    description:
      "Each ticket purchased gives you the chance to win an official merchandising survival pack.",
    badge: "Contest",
  },
];

const contests = [
  {
    title: "F1: The Movie – VIP Experience",
    description:
      "With every ticket, you’re entered into a draw to win official F1 merchandise and access to a private premiere screening.",
    badge: "Special",
  },
  {
    title: "I Know What You Did Last Summer – Horror Mystery Pack",
    description:
      "Buy a ticket and join the contest to win an exclusive horror-themed mystery box full of surprises.",
    badge: "Exclusive",
  },
];

export default {
  generalPromotions,
  moviePromotions,
  contests,
};
