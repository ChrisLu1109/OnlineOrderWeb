import React from "react";
import classes from "./cartPage.module.css";
import { useCart } from "../../hooks/useCart";
import Title from "../../components/Title/Title";
import { Link } from "react-router-dom";
import { addOrder } from "../../services/orderService";

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();

  const handleAddOrder = async () => {
    const testOrder = {
      id: 1,
      userID: 1,
      items: [1],
    };

    try {
      await addOrder(testOrder);
      alert("Test food item added successfully!");
    } catch (error) {
      console.error("Error adding test food item: ", error);
      alert("Error adding test food item.");
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
