import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebase-config';
import classes from './cartPage.module.css';
import { useCart } from '../../hooks/useCart';
import Title from '../../components/Title/Title';

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const [orderStatus] = useState('in progress');

  const handleAddOrder = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to place an order.');
      return;
    }

    const newOrder = {
      userID: user.email,
      orderStatus: orderStatus,
      items: cart.items.map((item) => ({
        id: item.food.id,
        quantity: item.quantity,
        calories: item.calories,
        name: item.food.name,
      })),
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      console.log('Order added with ID: ', docRef.id);
      alert('Order placed successfully!');
      clearCart();
    } catch (error) {
      console.error('Error adding order: ', error);
      alert('Error placing the order.');
    }
  };

  return (
    <>
      <Title title='Cart' margin='1.5rem 0 2.5rem' />
      {cart && cart.items.length > 0 && (
        <div className={classes.container}>
          <ul className={classes.list}>
            {cart.items.map((item) => (
              <li key={item.food.id}>
                <div>
                <img src={item.food.imageURL} alt={item.food.name} />
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
                    {[...Array(9).keys()].map(n => (
                      <option key={n+1} value={n+1}>{n+1}</option>
                    ))}
                  </select>
                  <div>Calories(kcals): {item.calories}</div>
                  <button
                    className={classes.remove_button}
                    onClick={() => removeFromCart(item.food.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className={classes.checkout}>
            <div>
              <div className={classes.food_count}>{cart.totalCount}</div>
              <div className={classes.food_calories}>{cart.totalCalories}</div>
            </div>
            <button onClick={handleAddOrder} className={classes.checkout_button}>
              Checkout
            </button>
            <button onClick={clearCart} className={classes.clear_cart_button}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}

