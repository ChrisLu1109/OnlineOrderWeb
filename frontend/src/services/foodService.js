// // import { sample_foods, sample_tags } from "../data";
// // import { db } from "./firebase-config";
// // import { collection, addDoc } from "firebase/firestore";

// // export const getAll = async () => sample_foods;

// // export const search = async (searchTerm) =>
// //   sample_foods.filter((item) =>
// //     item.name.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// // export const getAllTags = async () => sample_tags;

// // export const getAllByTag = async (tag) => {
// //   if (tag === "All") return getAll();
// //   return sample_foods.filter((item) => item.tags?.includes(tag));
// // };

// // export const getById = async (foodId) =>
// //   sample_foods.find((item) => item.id === foodId);

// // export const addFoodItem = async (foodItem) => {
// //   try {
// //     await addDoc(collection(db, "Foods"), {
// //       name: foodItem.name,
// //       imageUrl: foodItem.imageUrl,
// //       calories: foodItem.calories,
// //       cooktime: foodItem.cooktime,
// //       favorite: foodItem.favorite,
// //       allergy: foodItem.allergy,
// //     });
// //     console.log("Food item added successfully");
// //   } catch (error) {
// //     console.error("Error adding food item: ", error);
// //   }
// // };

// import { db } from "./firebase-config";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   doc,
//   getDoc,
//   addDoc,
// } from "firebase/firestore";

// // Fetch all foods from the database
// export const getAll = async () => {
//   const querySnapshot = await getDocs(collection(db, "foods"));
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// export const search = async (searchTerm) => {
//   const foodsCollectionRef = collection(db, "foods");
//   const querySnapshot = await getDocs(foodsCollectionRef);
//   const allFoods = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   // Filter on the client-side (not recommended for large datasets)
//   return allFoods.filter((item) =>
//     item.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );
// };

// export const getAllTags = async () => {
//   const allFoods = await getAll();
//   const allAllergies = new Set(allFoods.flatMap((food) => food.allergy || []));
//   return Array.from(allAllergies);
// };

// // Fetch foods that match a specific tag
// export const getAllByTag = async (tag) => {
//   if (tag === "All") {
//     return getAll();
//   } else {
//     const allFoods = await getAll();
//     return allFoods.filter((item) => item.tags?.includes(tag));
//   }
// };

// export const getById = async (foodId) => {
//   const foodsCollectionRef = collection(db, "foods");
//   const q = query(foodsCollectionRef, where("id", "==", foodId));
//   const querySnapshot = await getDocs(q);

//   if (!querySnapshot.empty) {
//     // Assuming that the id field is unique, there should only be one document.
//     const foodDoc = querySnapshot.docs[0];
//     return { id: foodDoc.id, ...foodDoc.data() };
//   } else {
//     console.error("No such food item with id:", foodId);
//     return null;
//   }
// };

// // Add a new food item to the database
// export const addFoodItem = async (foodItem) => {
//   try {
//     await addDoc(collection(db, "foods"), {
//       ...foodItem,
//     });
//     console.log("Food item added successfully");
//   } catch (error) {
//     console.error("Error adding food item: ", error);
//   }
// };

// // Fetch foods excluding those that contain allergens the user is allergic to
// export const getFoodsByDietaryRestrictions = async (userAllergies) => {
//   const foodsCollectionRef = collection(db, "foods");

//   // Fetch all foods from the database
//   const querySnapshot = await getDocs(foodsCollectionRef);
//   const allFoods = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   // Filter out foods that contain any of the user's allergens
//   const safeFoods = allFoods.filter((food) => {
//     // Assuming food.allergy is an array of allergens as shown in your database screenshot
//     const foodAllergens = food.allergy || [];
//     // Check if there's any overlap between user allergies and food allergens
//     return !foodAllergens.some((allergen) => userAllergies.includes(allergen));
//   });

//   return safeFoods;
// };
import { db } from "./firebase-config";
import { collection, getDocs, query, where, doc, getDoc, addDoc } from "firebase/firestore";

// Fetch all foods from the database
export const getAll = async () => {
  const querySnapshot = await getDocs(collection(db, "foods"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to filter foods based on dietary restrictions and tags
export const filterFoods = async (restrictions, tag) => {
  let foods = await getAll();

  // Filter based on dietary restrictions if any
  if (restrictions && restrictions.length > 0) {
    foods = foods.filter(food =>
      restrictions.every(restriction =>
        food.dietaryRestrictions && food.dietaryRestrictions[restriction]
      )
    );
  }

  // Further filter based on tag if provided
  if (tag && tag !== "All") {
    foods = foods.filter(food => food.tags?.includes(tag));
  }

  return foods;
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
