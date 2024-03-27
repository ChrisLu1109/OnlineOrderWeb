import React from "react";
import classes from "./cartPage.module.css";
import { useCart } from "../../hooks/useCart";
import Title from "../../components/Title/Title";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart } = useCart();

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
                  <select value={item.quantity}>
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
                  <div>Calories: {item.calories}</div>
                  <div>
                    <button className={classes.remove_button}>Remove</button>
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
              <Link to="/checkout">Checkout</Link>
            </button>
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}
