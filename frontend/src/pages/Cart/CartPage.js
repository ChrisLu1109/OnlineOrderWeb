import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../services/firebase-config";
import classes from "./cartPage.module.css";
import { useCart } from "../../hooks/useCart";
import Title from "../../components/Title/Title";

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const [orderStatus] = useState("in progress");
  const [userAllergies, setUserAllergies] = useState([]);
  const [allergicItems, setAllergicItems] = useState([]);

  useEffect(() => {
    const fetchUserAllergies = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserAllergies(userSnap.data().allergy || []);
        }
      }
    };

    fetchUserAllergies();
  }, []);

  useEffect(() => {
    const fetchAllergensForCartItems = async () => {
      // Map over cart items and create promises to fetch their allergens
      const promises = cart.items.map(async (item) => {
        const q = query(
          collection(db, "foods"),
          where("name", "==", item.food.name)
        );
        const querySnapshot = await getDocs(q);
        let allergens = [];
        querySnapshot.forEach((doc) => {
          // Assuming that the document data has an 'allergy' field that is an array
          allergens = doc.data().allergy || [];
          console.log(`Details for ${item.food.name}:`, {
            id: item.food.id,
            name: item.food.name,
            allergens: allergens,
            ...doc.data(), // Spread all properties of the document data
          });
        });
        return { id: item.food.id, name: item.food.name, allergens };
      });

      // Wait for all promises to resolve
      const itemsWithAllergens = await Promise.all(promises);
      console.log("Items with allergens:", itemsWithAllergens);

      // Filter items to find any that contain allergens the user is allergic to
      const allergicItemsFound = itemsWithAllergens.filter((item) =>
        item.allergens.some((allergen) => userAllergies.includes(allergen))
      );

      console.log("Allergic items found:", allergicItemsFound);
      setAllergicItems(allergicItemsFound);
    };

    if (cart.items.length > 0 && userAllergies.length > 0) {
      fetchAllergensForCartItems();
    }
  }, [cart, userAllergies]);

  // Check if there are any allergic items
  const containsAllergicItems = () => {
    return allergicItems.length > 0;
  };

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

      // Clear the cart here
      clearCart(); // Call the method to clear the cart
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
                  <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
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
            {/* Total count and calories display */}
            {containsAllergicItems() && (
              <div className={classes.warning}>
                Warning: There are items in your cart that match your allergies!
              </div>
            )}
            <button className={classes.checkout_button}>
              <button onClick={handleAddOrder}>Checkout</button>
            </button>
            <button onClick={clearCart} className={classes.clear_cart_button}>
              Clear Cart
            </button>
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}
