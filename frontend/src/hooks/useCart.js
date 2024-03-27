import React, { createContext, useContext, useState } from "react";
import { sample_foods } from "../data";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(
    sample_foods
      .slice(1, 3)
      .map((food) => ({ food, quantity: 1, calories: food.calories }))
  );
  const [totalCalories, setTotalCalories] = useState(400);
  const [totalCount, setTotalCount] = useState(3);

  return (
    <CartContext.Provider
      value={{ cart: { items: cartItems, totalCalories, totalCount } }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
