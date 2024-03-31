import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebase-config';
import SwitchBar from '../../components/SwitchBar/switchBar'; // Make sure this is the correct path to your component
import '../../components/SwitchBar/switchBar.css'; // And the CSS for styling the switch bar
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase-config';
import { doc, setDoc } from "firebase/firestore";

function Login() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginActive, setIsLoginActive] = useState(true); // State to toggle forms
  const [error, setError] = useState(""); // State to store authentication errors
  const [name, setName] = useState(""); 

  const login = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in", userCredential);
      navigate("/");
      // Redirect the user or update the state as needed
    } catch (error) {
      setError(error.message);
    }
  };

  const signUp = async () => {
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Assuming we want to store the user's name in Firestore under a 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        // You can add more user info here
      });
      console.log("User signed up and information added to Firestore", user.uid);
      navigate("/dietary"); // Redirect or handle post-signup logic
    } catch (error) {
      setError(error.message);
    }
  };

  // const signUp = async () => {
  //   setError("");
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     console.log("User signed up", userCredential);
  //     navigate("/dietary");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };


  const signInWithGoogle = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed in with Google");
      navigate("/dietary");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggle = (isLogin) => {
    setIsLoginActive(isLogin);
    setError(""); // Reset errors when toggling between forms
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
      <SwitchBar
        onLogin={() => handleToggle(true)}
        onSignUp={() => handleToggle(false)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={signInWithGoogle}
        style={{
          padding: "10px 20px",
          margin: "10px 0",
          backgroundColor: "white", // White background
          color: "#757575", // Gray text color
          border: "1px solid #757575", // Gray border
          borderRadius: "50px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)", // Slight shadow
        }}
      >
        <img
          src="/images/google_logo.png"
          alt="Google"
          className="google-logo"
          style={{
            marginRight: "10px", // Space between the logo and text
            width: "20px", // Reduce width as needed
            height: "20px", // Reduce height as needed
            display: "block", // Ensures the image doesn't align text to its bottom
            alignSelf: "center", // Centers the image vertically in case the button is taller
          }}
        />
        Sign in with Google
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          margin: "20px 0", // Adjust margin to space it out from other elements
        }}
      >
        <span style={{ padding: "0 10px", fontSize: "12px", color: "#ccc" }}>
          --------OR--------
        </span>
      </div>

      <div
        style={{
          width: "100%",
        }}
      >
      <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Name"
    style={{
      width: "100%",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      fontSize: "16px",
    }}
  />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <button
          onClick={isLoginActive ? login : signUp}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: isLoginActive ? "#007bff" : "#4CAF50", // Blue for login, green for sign up
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {isLoginActive ? "Login" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default Login;
