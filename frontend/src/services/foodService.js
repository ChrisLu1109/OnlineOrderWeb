// import { sample_foods, sample_tags } from "../data";
// import { db } from "./firebase-config";
// import { collection, addDoc } from "firebase/firestore";

// export const getAll = async () => sample_foods;

// export const search = async (searchTerm) =>
//   sample_foods.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

// export const getAllTags = async () => sample_tags;

// export const getAllByTag = async (tag) => {
//   if (tag === "All") return getAll();
//   return sample_foods.filter((item) => item.tags?.includes(tag));
// };

// export const getById = async (foodId) =>
//   sample_foods.find((item) => item.id === foodId);

// export const addFoodItem = async (foodItem) => {
//   try {
//     await addDoc(collection(db, "Foods"), {
//       name: foodItem.name,
//       imageUrl: foodItem.imageUrl,
//       calories: foodItem.calories,
//       cooktime: foodItem.cooktime,
//       favorite: foodItem.favorite,
//       allergy: foodItem.allergy,
//     });
//     console.log("Food item added successfully");
//   } catch (error) {
//     console.error("Error adding food item: ", error);
//   }
// };

import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";

// Fetch all foods from the database
export const getAll = async () => {
  const querySnapshot = await getDocs(collection(db, "foods"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const search = async (searchTerm) => {
  const foodsCollectionRef = collection(db, "foods");
  const querySnapshot = await getDocs(foodsCollectionRef);
  const allFoods = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Filter on the client-side (not recommended for large datasets)
  return allFoods.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getAllTags = async () => {
  const allFoods = await getAll();
  const allAllergies = new Set(allFoods.flatMap((food) => food.allergy || []));
  return Array.from(allAllergies);
};

// Fetch foods that match a specific tag
export const getAllByTag = async (tag) => {
  if (tag === "All") {
    return getAll();
  } else {
    const allFoods = await getAll();
    return allFoods.filter((item) => item.tags?.includes(tag));
  }
};

export const getById = async (foodId) => {
  const foodsCollectionRef = collection(db, "foods");
  const q = query(foodsCollectionRef, where("id", "==", foodId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Assuming that the id field is unique, there should only be one document.
    const foodDoc = querySnapshot.docs[0];
    return { id: foodDoc.id, ...foodDoc.data() };
  } else {
    console.error("No such food item with id:", foodId);
    return null;
  }
};

// Add a new food item to the database
export const addFoodItem = async (foodItem) => {
  try {
    await addDoc(collection(db, "foods"), {
      ...foodItem,
    });
    console.log("Food item added successfully");
  } catch (error) {
    console.error("Error adding food item: ", error);
  }
};

// Fetch foods that comply with selected dietary restrictions
export const getFoodsByDietaryRestrictions = async (restrictions) => {
  const foodsCollectionRef = collection(db, "foods");

  // If no restrictions are selected, return all foods
  if (restrictions.length === 0) {
    return getAll();
  }

  // Create a combined query based on selected restrictions
  const combinedQueries = restrictions.map((restriction) => {
    return query(
      foodsCollectionRef,
      where(`dietaryRestrictions.${restriction}`, "==", true)
    );
  });

  // Execute each query and combine the results
  const foods = [];
  for (let q of combinedQueries) {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const food = { id: doc.id, ...doc.data() };
      if (!foods.some((f) => f.id === food.id)) {
        foods.push(food);
      }
    });
  }
  return foods;
};
