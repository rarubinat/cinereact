// Page component to display the cinema loyalty program, including features and membership tiers

import React from "react";
import useReservationCount from "../hooks/ReservationCount"; // Custom hook to get user's total loyalty points
import { loyaltyFeatures, loyaltyTiers, icons } from "../../data/fidelityData"; // Import static data for loyalty features, tiers, and icons

const { Star, Lock } = icons; // Destructure icons for use in the UI

const LoyaltyPage = () => {
  // Get total loyalty points from the custom hook
  const { totalPoints } = useReservationCount();

  // Find the next tier the user hasn't reached yet
  const nextTier = loyaltyTiers.find((tier) => totalPoints < tier.min);

  return (
    <div className="min-h-screen px-6 md:px-12 py-12">
      {/* Page title */}
      <h3 className="text-3xl font-bold text-black mb-4">Cinema Loyalty Program</h3>

      {/* Section: Loyalty program features */}
      <h2 className="text-2xl font-bold text-black mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loyaltyFeatures.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
          >
            {feature.icon} {/* Display feature icon */}
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Section: Membership tiers */}
      <h2 className="text-2xl font-bold text-black mb-6">Membership Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loyaltyTiers.map((tier, idx) => {
          // Determine if the user has unlocked this tier
          const isUnlocked = totalPoints >= tier.min;

          // Determine if this tier is the user's current tier
          const isCurrent =
            totalPoints >= tier.min && (tier.max === Infinity || totalPoints <= tier.max);

          // Calculate progress percentage within the tier
          const progress =
            tier.max === Infinity
              ? isUnlocked
                ? 100
                : 0
              : Math.min(
                  100,
                  Math.max(0, ((totalPoints - tier.min) / (tier.max - tier.min)) * 100)
                );

          return (
            <div
              key={idx}
              className={`border rounded-2xl p-6 text-center shadow-sm transition relative
                ${isUnlocked ? "bg-white hover:shadow-lg" : "bg-gray-200 text-gray-400"}
                ${isCurrent ? "border-4 border-yellow-400" : ""}`}
            >
              {/* Lock icon if tier is not unlocked */}
              {!isUnlocked && (
                <div className="absolute top-4 right-4 text-gray-500">
                  <Lock className="w-6 h-6" />
                </div>
              )}

              {/* Tier badge */}
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
                  isUnlocked ? "bg-yellow-500 text-white" : "bg-gray-400 text-gray-200"
                }`}
              >
                {tier.badge}
              </span>

              {/* Tier name */}
              <h3 className="text-lg font-bold mb-2">{tier.tier}</h3>

              {/* Tier benefits list */}
              <ul className="text-sm mb-3 text-left mx-8">
                {tier.description.map((benefit, i) => (
                  <li key={i} className="flex items-center mb-1" title={benefit}>
                    <Star className="w-4 h-4 mr-2 text-yellow-500" /> {/* Bullet icon */}
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Progress bar showing user's points within this tier */}
              <div className="w-full bg-gray-300 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    isUnlocked ? "bg-yellow-500" : "bg-gray-400"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Display user's points vs tier maximum */}
              <p className="text-xs mb-2">
                {totalPoints} / {tier.max === Infinity ? "∞" : tier.max} points
              </p>

              {/* Show points needed for next tier if this is current tier */}
              {isCurrent && nextTier && (
                <p className="text-xs text-gray-700 mt-1">
                  {nextTier.min - totalPoints} points to reach {nextTier.tier}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoyaltyPage;
