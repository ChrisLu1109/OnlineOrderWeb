import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase-config";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));
      try {
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(), // Convert timestamp to Date object
          }))
          .filter((order) => order.orderstatus === "in progress");
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const markAsFinished = async (id) => {
    const orderDocRef = doc(db, "orders", id);
    try {
      await updateDoc(orderDocRef, {
        orderstatus: "finished",
      });
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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
    button: {
      padding: "10px 15px",
      margin: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      border: "none",
      background: "#28a745",
      color: "white",
    },
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders to manage at the moment.</div>;
  }

  return (
    <>
      <div style={styles.title}>Order Management</div>
      {orders.map((order) => (
        <div key={order.id} style={styles.orderCard}>
          <div>Order ID: {order.id}</div>
          <div>User ID: {order.userID}</div>
          <div>Status: {order.orderstatus}</div>
          <div>
            Created At:{" "}
            {order.createdAt ? order.createdAt.toLocaleString() : "Unknown"}
          </div>
          {/* List items as before */}
          <button
            style={styles.button}
            onClick={() => markAsFinished(order.id)}
          >
            Mark as Finished
          </button>
        </div>
      ))}
    </>
  );
}
