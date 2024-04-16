import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase-config";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function Profile() {
  let navigate = useNavigate();
  const [name, setName] = useState(auth.currentUser?.displayName || "");

  const logout = async () => {
    await signOut(auth);
    navigate("/login"); // Redirect to login after logout
  };

  const updateName = async () => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name })
        .then(() => {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          return updateDoc(userDocRef, { name: name });
        })
        .then(() => alert("Name updated successfully."))
        .catch((error) => {
          console.error("Error updating name: ", error);
          alert("Failed to update name.");
        });
    }
  };

  const navigateToRestrictions = () => {
    navigate("/dietary"); // Navigate to the dietary restrictions page
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
    }}>
      <h2>Profile Page</h2>
      <p>Email: {auth.currentUser?.email}</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Change your name" style={{ padding: "10px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ccc", }} />
      <button onClick={updateName} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "50px", cursor: "pointer", fontSize: "16px", margin: "10px 0", }}>Update Name</button>
      <button onClick={navigateToRestrictions} style={{ padding: "10px 20px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "50px", cursor: "pointer", fontSize: "16px", margin: "10px 0", }}>Dietary Restrictions</button>
      <button onClick={logout} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "50px", cursor: "pointer", fontSize: "16px", margin: "10px 0", }}>Logout</button>
    </div>
  );
}

export default Profile;
