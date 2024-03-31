import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import Title from "../../components/Title/Title";
import { Link } from "react-router-dom";
import { db, auth } from "../../services/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import classes from "./cartPage.module.css";

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const [orderStatus, setOrderStatus] = useState("in progress"); // State to hold the order status

  const handleAddOrder = async () => {
    const user = auth.currentUser; // Get the current user directly from Firebase Auth

    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    // Construct the order object
    const newOrder = {
      userID: user.email,
      orderstatus: orderStatus,
      items: cart.items.map((item) => ({
        id: item.food.id, // Assuming each item has a unique id
        quantity: item.quantity,
        calories: item.calories,
        name: item.food.name, // Assuming you want to store the name of the food
      })),
    };

    try {
      // Add the new order to the 'orders' collection in Firestore
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      console.log("Order added with ID: ", docRef.id);
      alert("Order placed successfully!");
      // Optionally reset the cart after the order is placed
    } catch (error) {
      console.error("Error adding order: ", error);
      alert("Error placing the order.");
    }
  };

  return (
    <>
      <Title title="Cart" margin="1.5rem 0 2.5rem" />
      {cart && cart.items.length > 0 && (
        <div className={classes.container}>
          <ul className={classes.list}>
            {cart.items.map((item) => (
              <li key={item.food.id}>
                <div>
                  <img
                    src={`/foods/${item.food.imageURL}`}
                    alt={item.food.name}
                  />
                </div>
                <div>
                  <Link to={"/food/${item.food.id}"}>{item.food.name}</Link>
                </div>
                <div>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      changeQuantity(item, Number(e.target.value))
                    }
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                  </select>
                  <div>Calories(kcals): {item.calories}</div>
                  <div>
                    <button
                      className={classes.remove_button}
                      onClick={() => removeFromCart(item.food.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className={classes.checkout}>
            <div>
              <div className={classes.food_count}>{cart.totalCount}</div>
              <div className={classes.food_calories}>{cart.totalCalories}</div>
            </div>
            <button className={classes.checkout_button}>
              <button onClick={handleAddOrder}>Checkout</button>
            </button>
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}
