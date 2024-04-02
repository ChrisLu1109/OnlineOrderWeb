import React, { useState, useEffect } from "react";
import { db, auth } from "../../services/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import classes from "./order.module.css";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to view your orders.");
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("userID", "==", user.email)
      );
      try {
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const styles = {
    title: {
      textAlign: "center",
      margin: "20px 0",
      fontSize: "24px",
    },
    orderCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      margin: "10px 0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    listItem: {
      listStyleType: "none",
    },
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <>
      <div style={styles.title}>Your Orders</div>
      {orders.map((order) => (
        <div key={order.id} style={styles.orderCard}>
          <div>Order ID: {order.id}</div>
          <div>Status: {order.orderstatus}</div>
          <ul>
            {order.items.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <div>Name: {item.name}</div>
                <div>Quantity: {item.quantity}</div>
                <div>Calories: {item.calories} kcals</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
