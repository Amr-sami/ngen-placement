import React from "react";

function Rating({ feedbackRating }: { feedbackRating: number }) {
  let clampedRating: number;

  // Validate the feedback rating is between 1 to 5
  if (typeof feedbackRating === "number")
    clampedRating = Math.max(1, Math.min(feedbackRating, 5));

  return (
    <div className="flex gap-1 pt-1">
      {typeof feedbackRating === "number" &&
        Array.from({ length: 5 }, (_, index) => (
          <svg
            key={index}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={index < clampedRating ? "#FFD700" : "none"}
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        ))}
    </div>
  );
}

export default Rating;
