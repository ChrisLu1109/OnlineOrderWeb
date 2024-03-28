import React, { useEffect, useReducer } from "react";
import {
  getAll,
  search,
  getAllTags,
  getAllByTag,
  addFoodItem,
} from "../../services/foodService"; // Make sure to import addFoodItem
import Thumbnails from "../../components/Thumbnails/Thumbnails";
import { useParams } from "react-router-dom";
import Search from "../../components/Search/Search";
import Tags from "../../components/Tags/Tags";

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case "FOODS_LOADED":
      return { ...state, foods: action.payload };
    case "TAGS_LOADED":
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();

  useEffect(() => {
    getAllTags().then((tags) =>
      dispatch({ type: "TAGS_LOADED", payload: tags })
    );

    const foodPromise = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    foodPromise.then((foods) => {
      dispatch({ type: "FOODS_LOADED", payload: foods });
    });
  }, [searchTerm, tag]);

  // Test function to add a food item
  const handleAddTestFood = async () => {
    const testFoodItem = {
      name: "Test Food",
      imageUrl: "http://example.com/image.jpg",
      calories: 500,
      cooktime: "20min",
      favorite: false,
      allergy: ["Nuts"],
    };

    try {
      await addFoodItem(testFoodItem);
      alert("Test food item added successfully!");
    } catch (error) {
      console.error("Error adding test food item: ", error);
      alert("Error adding test food item.");
    }
  };

  return (
    <>
      <Search />
      <Tags tags={tags} />
      <Thumbnails foods={foods} />
      {/* Add a button to trigger the test food item addition */}
      <button onClick={handleAddTestFood}>Add Test Food Item</button>
    </>
  );
}
