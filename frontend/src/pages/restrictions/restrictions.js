import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase-config"; // Ensure these are correctly imported
import { doc, updateDoc } from "firebase/firestore"; // Import updateDoc for updating a document

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  const handleButtonClick = (restriction) => {
    if (selectedRestrictions.includes(restriction)) {
      setSelectedRestrictions((current) =>
        current.filter((r) => r !== restriction)
      );
    } else {
      setSelectedRestrictions((current) => [...current, restriction]);
    }
  };

  const handleConfirmClick = () => {
    updateUserAllergies(selectedRestrictions); // Update allergies in Firestore
    navigate("/"); // Then navigate to the homepage
  };

  useEffect(() => {
    const combinedTerm = selectedRestrictions.join(" + ");
    setSearchTerm(combinedTerm);
    if (onSearch) {
      onSearch(combinedTerm);
    }
  }, [selectedRestrictions, onSearch]);

  const updateUserAllergies = async (allergies) => {
    if (!auth.currentUser) {
      console.error("No user is currently logged in.");
      return;
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        allergy: allergies,
      });
      console.log("User allergies updated in Firestore");
    } catch (error) {
      console.error("Error updating user allergies:", error);
    }
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
        {[
          "Peanuts",
          "Meat",
          "Dairy",
          "Vegan",
          "Egg",
          "Fish",
          "Gluton",
          "Soy",
          "Nut",
          "Alcohol",
        ].map((restriction) => (
          <button
            key={restriction}
            onClick={() => handleButtonClick(restriction)}
            style={{
              width: "180px", // Set a fixed width
              height: "50px", // Set a fixed height
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
