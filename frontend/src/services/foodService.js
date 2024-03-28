import { sample_foods, sample_tags } from "../data";
import { db } from "./firebase-config";
import { collection, addDoc } from "firebase/firestore";

export const getAll = async () => sample_foods;

export const search = async (searchTerm) =>
  sample_foods.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

export const getAllTags = async () => sample_tags;

export const getAllByTag = async (tag) => {
  if (tag === "All") return getAll();
  return sample_foods.filter((item) => item.tags?.includes(tag));
};

export const getById = async (foodId) =>
  sample_foods.find((item) => item.id === foodId);

export const addFoodItem = async (foodItem) => {
  try {
    await addDoc(collection(db, "Foods"), {
      name: foodItem.name,
      imageUrl: foodItem.imageUrl,
      calories: foodItem.calories,
      cooktime: foodItem.cooktime,
      favorite: foodItem.favorite,
      allergy: foodItem.allergy,
    });
    console.log("Food item added successfully");
  } catch (error) {
    console.error("Error adding food item: ", error);
  }
};
