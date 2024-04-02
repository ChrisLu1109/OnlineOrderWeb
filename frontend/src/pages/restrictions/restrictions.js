import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const navigate = useNavigate();

  // Handles changes to the search input field
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  // Handles click events for each restriction button
  const handleButtonClick = (restriction) => {
    if (selectedRestrictions.includes(restriction)) {
      setSelectedRestrictions((current) =>
        current.filter((r) => r !== restriction)
      );
    } else {
      setSelectedRestrictions((current) => [...current, restriction]);
    }
  };

  // Navigates back to the homepage and potentially could pass the selected restrictions
  const handleConfirmClick = () => {
    navigate("/", { state: { selectedRestrictions } }); // Passing state through navigation
  };

  // Updates searchTerm when selectedRestrictions change
  useEffect(() => {
    const combinedTerm = selectedRestrictions.join(" + ");
    setSearchTerm(combinedTerm);
    if (onSearch) {
      onSearch(combinedTerm);
    }
  }, [selectedRestrictions, onSearch]);

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
      <input
        type="text"
        placeholder="Dietary Restrictions"
        value={searchTerm}
        onChange={handleChange}
        style={{
          width: "60%",
          padding: "20px",
          fontSize: "1.5rem",
          borderRadius: "25px",
          border: "1px solid #ccc",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      />

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
        Confirm
      </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1024px",
        }}
      >
        {["Peanuts", "Dairy", "Meat", "Eggs", "Alcohol"].map((restriction) => (
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
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
