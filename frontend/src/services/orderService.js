import { db } from "./firebase-config";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";

// Function to get a reference to a user document
const getUserDocRef = (email) => {
  return doc(db, "User_Info", email);
};

export const addOrder = async (order) => {
  try {
    await addDoc(collection(db, "Orders"), {
      orderID: order.id,
      userID: order.userID,
      items: order.items,
    });
    console.log("Order added successfully");
  } catch (error) {
    console.error("Error adding order: ", error);
  }
};

export const getUserInfo = async (email) => {
  try {
    const userRef = getUserDocRef(email);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user info: ", error);
    return null;
  }
};

export const updateUserInfo = async (email, updatedInfo) => {
  try {
    const userRef = getUserDocRef(email);
    await updateDoc(userRef, updatedInfo);
    console.log("User info updated successfully");
  } catch (error) {
    console.error("Error updating user info: ", error);
  }
};

export const deleteUser = async (email) => {
  try {
    const userRef = getUserDocRef(email);
    await deleteDoc(userRef);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
};
