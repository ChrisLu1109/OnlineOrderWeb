import React, { createContext, useContext, useEffect, useState } from "react";
import { sample_foods } from "../data";

const CartContext = createContext(null);
const CART_KEY = 'cart';
const EMPTY_CART = {
  items: [],
  totalCalories: 0,
  totalCount: 0,
}


export default function CartProvider({ children }) {
  const initCart = getCartFromLocalStorage();
  const [cartItems, setCartItems] = useState(initCart.items)
  const [totalCalories, setTotalCalories] = useState(initCart.totalCalories);
  const [totalCount, setTotalCount] = useState(initCart.totalCount);

  useEffect(() => {
    const totalCalories = sum(cartItems.map(item => item.calories));
    const totalCount = sum(cartItems.map(item => item.quantity));
    setTotalCount(totalCount);
    setTotalCalories(totalCalories);

    localStorage.setItem(CART_KEY,JSON.stringify({
      items: cartItems,
      totalCount,
      totalCalories,
    }))

  }, [cartItems]);

  function getCartFromLocalStorage(){
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart? JSON.parse(storedCart) : EMPTY_CART;
  }

  const sum = items => {
    return items.reduce((prevValue, curValue) => prevValue+curValue, 0);
  }

  const removeFromCart = foodId => {
    const filteredCartItems = cartItems.filter(item => item.food.id != foodId);
    setCartItems(filteredCartItems);
  };

  const changeQuantity = (cartItem, newQuantity) =>{
    const {food} = cartItem;

    const changedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      calories: food.calories*newQuantity,
    };

    setCartItems(
      cartItems.map(item => (item.food.id === food.id ? changedCartItem : item))
    );
  };

  const addToCart = food => {
    const cartItem = cartItems.find(item => item.food.id === food.id);
    if (cartItem) {
      changeQuantity(cartItem, cartItem.quantity + 1);
    }else {
      setCartItems([...cartItems, {food, quantity: 1, calories: food.calories}]);
    }
  }



  return (
    <CartContext.Provider
      value={{ 
        cart: { items: cartItems, totalCalories, totalCount },
        removeFromCart, 
        changeQuantity,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
