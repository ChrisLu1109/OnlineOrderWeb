import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DietaryRestrictionsPage() {
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const navigate = useNavigate();

  // Handles click events for each dietary restriction button
  const handleButtonClick = (restriction) => {
    setSelectedRestrictions((current) =>
      current.includes(restriction)
        ? current.filter((r) => r !== restriction)
        : [...current, restriction]
    );
  };

  // Navigates back to the homepage and passes the selected restrictions
  const handleConfirmClick = () => {
    navigate("/", { state: { selectedRestrictions } });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop: "-100px",
      }}
    >
      <h2>Select Dietary Restrictions</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1024px",
        }}
      >
        {["None", "Lacto-vegetarian", "Ovo-vegetarian",
          "Lacto-ovo vegetarian", "Vegan", "Pescatarian", "Keto",
          "Gluten-Free", "Dairy-Free", "Halal", "Kosher",
          "Nut-Free", "Low Sodium", "Low Sugar", "Low Calories"].map(
          (restriction) => (
            <button
              key={restriction}
              onClick={() => handleButtonClick(restriction)}
              style={{
                width: "180px",
                height: "50px",
                padding: "10px",
                margin: "5px",
                backgroundColor: selectedRestrictions.includes(restriction)
                  ? "#007bff"
                  : "#f0f0f0",
                color: selectedRestrictions.includes(restriction)
                  ? "white"
                  : "black",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {restriction}
            </button>
          )
        )}
      </div>
      <button
        onClick={handleConfirmClick}
        style={{
          padding: "10px 20px",
          margin: "10px 0",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          fontSize: "1rem",
          boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Confirm Selection
      </button>
    </div>
  );
}

export default DietaryRestrictionsPage;
