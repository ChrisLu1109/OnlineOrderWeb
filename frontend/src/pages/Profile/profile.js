import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase-config';
import { signOut } from "firebase/auth";

function Profile() {
    let navigate = useNavigate();

    const logout = async () => {
        await signOut(auth);
        navigate("/login"); // Redirect to login after logout
    };

    return (
        <div
            style={{
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
            }}
        >
            <h2>Profile Page</h2>
            <p>Email: {auth.currentUser?.email}</p>
            <button
                onClick={logout}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#f44336", // Red color for logout button
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginTop: "20px",
                }}
            >
                Logout
            </button>
        </div>
    );
}

export default Profile;
