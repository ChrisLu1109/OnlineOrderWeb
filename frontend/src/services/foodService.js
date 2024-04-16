
import { db } from "./firebase-config";
import { collection, getDocs, query, where, doc, getDoc, addDoc } from "firebase/firestore";

// Fetch all foods from the database
export const getAll = async () => {
  const querySnapshot = await getDocs(collection(db, "foods"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to filter foods based on dietary restrictions
// Function to filter foods based on dietary restrictions
export const filterFoods = async (restrictions) => {
  let foods = await getAll();

  // Filter based on dietary restrictions if any
  if (restrictions && restrictions.length > 0) {
    // Only include foods that match all of the user's dietary restrictions
    foods = foods.filter(food => {
      return restrictions.every(restriction => {
        // Check that the food's dietaryRestrictions object has the restriction set to true
        return food.dietaryRestrictions && food.dietaryRestrictions[restriction];
      });
    });
  }

  return foods;
};

// Function to categorize foods based on tags
export const getFoodsByTag = async (tag) => {
  let foods = await getAll();

  // If tag is 'All', return all foods
  if (tag === 'All') {
    return foods;
  }

  // Otherwise, filter foods by the given tag
  return foods.filter(food => food.tags?.includes(tag));
};

// Fetch a single food item by ID

export const getById = async (foodId) => {
  try {
    // Create a reference to the collection
    const foodsCollectionRef = collection(db, "foods");
    // Create a query against the collection for the id field
    const q = query(foodsCollectionRef, where("id", "==", foodId));
    // Execute the query
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming that the id field is unique, there should only be one document.
      const foodDoc = querySnapshot.docs[0];
      return { id: foodDoc.id, ...foodDoc.data() };
    } else {
      console.error("No such food item with ID:", foodId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};

// Add a new food item to the database
export const addFoodItem = async (foodItem) => {
  try {
    await addDoc(collection(db, "foods"), {
      ...foodItem
    });
    console.log("Food item added successfully");
  } catch (error) {
    console.error("Error adding food item: ", error);
  }
};

// Get a list of all unique tags from the foods
export const getAllTags = async () => {
  const allFoods = await getAll();
  const allTags = new Set(allFoods.flatMap(item => item.tags || []));
  return Array.from(allTags);
};

// Search for foods that match a given search term
export const search = async (searchTerm) => {
  const allFoods = await getAll();
  return allFoods.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
