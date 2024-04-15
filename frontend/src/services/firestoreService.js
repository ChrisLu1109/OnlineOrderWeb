import { db } from './firebase-config';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export const addSampleFoodsToFirestore = async (foodData) => {
  console.log(foodData);
  try {
    const docRef = await addDoc(collection(db, "foods"), foodData);
    console.log("Document written with ID: ", docRef.id); // Helpful for debugging and confirming the operation
    return docRef; // Optionally return the document reference
  } catch (error) {
    console.error("Error adding document to Firestore:", error); // Log the error for debugging
    throw new Error(`Error adding document: ${error}`);
  }
};

  // Function to fetch all foods from Firestore
export const getFoodsFromFirestore = async () => {
  const foodCollection = collection(db, 'foods');
  const foodSnapshot = await getDocs(foodCollection);
  const foodList = foodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return foodList;
};

// Function to update a food item in Firestore
export const updateFoodInFirestore = async (id, updatedFields) => {
  const foodRef = doc(db, 'foods', id);
  try {
      await updateDoc(foodRef, updatedFields);
      console.log("Document updated with ID:", id);
  } catch (error) {
      console.error("Error updating document:", error);
      throw error;
  }
};

// Function to delete a food item from Firestore
export const deleteFoodItem = async (foodId) => {
  try {
    const foodRef = doc(db, "foods", foodId);
    await deleteDoc(foodRef);
    console.log("Document deleted with ID: ", foodId);
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};

export const getFoodByIdFromFirestore = async (id) => {
  const foodDocRef = doc(db, 'foods', id);
  const foodDocSnap = await getDoc(foodDocRef);
  if (foodDocSnap.exists()) {
      return foodDocSnap.data();
  } else {
      return null;  // Returns null if the food item does not exist
  }
};