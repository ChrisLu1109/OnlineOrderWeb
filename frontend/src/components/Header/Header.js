import React, { useEffect, useState } from "react";
import classes from "./header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { auth } from "../../services/firebase-config";


export default function Header() {
  // const user = {
  //   name: "Chris",
  // };
  const { cart } = useCart();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe; // Unsubscribe from the listener when the component unmounts
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // const logout = () => {};

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>
          Welcome to Rand Dining Center!
        </Link>
        <nav>
          <ul>
            {currentUser ? (
              <li className={classes.menu_container}>
                <Link to="/profile">
                  {currentUser.displayName || currentUser.email}
                </Link>
                <div className={classes.menu}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/order">Order</Link>
                  <a
                    href="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    Logout
                  </a>
                </div>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}

            <li>
              {currentUser ? (
                <Link to="/cart">
                  Cart
                  {cart.totalCount > 0 ? (
                    <span className={classes.cart_count}>
                      {cart.totalCount}
                    </span>
                  ) : (
                    <span className={classes.cart_count}>0</span>
                  )}
                </Link>
              ) : (
                <Link to="/cart">
                  Cart <span className={classes.cart_count}>0</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
