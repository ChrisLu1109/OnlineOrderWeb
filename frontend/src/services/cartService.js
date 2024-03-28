import { db } from "./firebase-config";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// Assume currentUser is obtained from authentication context or similar
const currentUserEmail = "user@example.com";

// Utility function to get a user's cart collection reference
const getUserCartCollectionRef = () => {
  return collection(db, "User_Info", currentUserEmail, "User_Cart");
};

// Utility function to get a user's cart items collection reference
const getCartItemsCollectionRef = (cartId) => {
  return collection(
    db,
    "User_Info",
    currentUserEmail,
    "User_Cart",
    cartId,
    "Cart_Items"
  );
};

export const addItemToCart = async (cartId, foodItem) => {
  try {
    const cartItemsRef = getCartItemsCollectionRef(cartId);
    await setDoc(doc(cartItemsRef), {
      food_id: foodItem.food_id, // Assuming this is a reference or the ID of the food item
      quantity: foodItem.quantity,
    });
    console.log("Item added to cart successfully");
  } catch (error) {
    console.error("Error adding item to cart: ", error);
  }
};

export const getCartItems = async (cartId) => {
  try {
    const cartItemsRef = getCartItemsCollectionRef(cartId);
    const snapshot = await getDocs(cartItemsRef);
    const cartItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items: ", error);
    return [];
  }
};

export const updateCartItem = async (cartId, itemId, quantity) => {
  try {
    const cartItemRef = doc(
      db,
      "User_Info",
      currentUserEmail,
      "User_Cart",
      cartId,
      "Cart_Items",
      itemId
    );
    await updateDoc(cartItemRef, {
      quantity: quantity,
    });
    console.log("Cart item updated successfully");
  } catch (error) {
    console.error("Error updating cart item: ", error);
  }
};

export const removeCartItem = async (cartId, itemId) => {
  try {
    const cartItemRef = doc(
      db,
      "User_Info",
      currentUserEmail,
      "User_Cart",
      cartId,
      "Cart_Items",
      itemId
    );
    await deleteDoc(cartItemRef);
    console.log("Cart item removed successfully");
  } catch (error) {
    console.error("Error removing cart item: ", error);
  }
};
