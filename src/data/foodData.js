// foodData.js
// This file defines the list of food and drink items available in the cinema.
// Each item includes an id, name, description, price, and a reference to an icon used in the UI.

export const foodData = [
  {
    id: 1, // Unique identifier for the item
    name: "Small Popcorn", // Name of the product
    description: "Classic buttered popcorn, perfect for one.", // Short description
    price: 4.0, // Price in euros
    icon: "Popcorn", // Icon representing the product
  },
  {
    id: 2,
    name: "Large Popcorn",
    description: "Big bucket of buttery popcorn to share.",
    price: 6.5,
    icon: "Popcorn",
  },
  {
    id: 3,
    name: "Coca-Cola Small",
    description: "Refreshing 250ml Coke.",
    price: 3.0,
    icon: "CupSoda",
  },
  {
    id: 4,
    name: "Coca-Cola Large",
    description: "Refreshing 500ml Coke.",
    price: 4.5,
    icon: "CupSoda",
  },
  {
    id: 5,
    name: "Combo: Large Popcorn + Large Coke",
    description: "Perfect combo for movie night.",
    price: 9.0,
    icon: "Popcorn",
  },
];

// Default export for easy import in other components
export default foodData;
