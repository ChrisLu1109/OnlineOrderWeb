import React, { useState } from "react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "VandyDiningAdmin") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  if (isLoggedIn) {
    const managementButtonStyle = {
      padding: "10px 20px",
      margin: "10px",
      fontSize: "1.2em",
      cursor: "pointer",
      borderRadius: "20px",
      background: "#007bff",
      color: "white",
      display: "block", // Ensures that each button is on a new line
      width: "200px", // Fixed width for both buttons
      textAlign: "center", // Centers the text inside the button
      textDecoration: "none", // Removes the underline from the links
    };

    const containerStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    };

    return (
      <div style={containerStyle}>
        <a href="/food-management" style={managementButtonStyle}>
          Food Management
        </a>
        <a href="/order-management" style={managementButtonStyle}>
          Order Management
        </a>
      </div>
    );
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const inputStyle = {
    width: "60%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "1.2em",
  };

  const buttonStyle = {
    width: "52%", // slightly larger than input for a good visual effect
    padding: "10px",
    margin: "10px 0",
    fontSize: "1.2em",
    cursor: "pointer",
    borderRadius: "20px",
  };

  const errorStyle = {
    color: "red",
    marginTop: "10px",
  };

  return (
    <div style={formStyle}>
      <h2>Stuff Login</h2>
      <input
        type="text"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleLogin} style={buttonStyle}>
        Login
      </button>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
