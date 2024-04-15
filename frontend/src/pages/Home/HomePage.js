// import React, { useEffect, useReducer } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import {
//   getFoodsByDietaryRestrictions,
//   getAllTags,
//   getAllByTag,
//   getAll,
//   search, // Assuming you have a search function that matches the searchTerm against food items
// } from "../../services/foodService";
// import Thumbnails from "../../components/Thumbnails/Thumbnails";
// import SearchBar from "../../components/Search/Search";
// import Tags from "../../components/Tags/Tags";

// // Assuming db setup is correctly imported for your Firestore queries
// import { db } from "../../services/firebase-config";

// const initialState = { foods: [], tags: [] };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FOODS_LOADED":
//       return { ...state, foods: action.payload };
//     case "TAGS_LOADED":
//       return { ...state, tags: action.payload };
//     default:
//       return state;
//   }
// };

// function HomePage() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { foods, tags } = state;
//   const location = useLocation();
//   const { searchTerm } = useParams();

//   const handleTagClick = async (tagName) => {
//     const foodsByTag = await getAllByTag(tagName); // Use the service function to fetch foods by tag
//     dispatch({ type: "FOODS_LOADED", payload: foodsByTag }); // Update the state with the fetched foods
//   };

//   useEffect(() => {
//     // Always fetch and load tags
//     getAllTags().then((tagsData) => {
//       const tagsWithNames = tagsData.map((tagName) => ({ name: tagName }));
//       dispatch({ type: "TAGS_LOADED", payload: tagsWithNames });
//     });

//     if(searchTerm) {
//       // If there's a searchTerm, use it to search foods
//       search(searchTerm).then((foodsData) => {
//         dispatch({ type: "FOODS_LOADED", payload: foodsData });
//       });
//     } else {
//       // Handle dietary restrictions or load all foods if no filters are specified
//       const restrictions = location.state?.selectedRestrictions || [];
//       if (restrictions.length > 0) {
//         getFoodsByDietaryRestrictions(restrictions).then((foodsData) => {
//           dispatch({ type: "FOODS_LOADED", payload: foodsData });
//         });
//       } else {
//         // You could implement a getAllFoods function if needed
//         getAll().then((foodsData) => {
//           dispatch({ type: "FOODS_LOADED", payload: foodsData });
//         });
//       }
//     }
//   }, [searchTerm, location.state]);

//   return (
//     <>
//       <SearchBar onSearch={(term) => console.log(term)} />
//       <Tags tags={tags} onTagClick={handleTagClick} />
//       <Thumbnails foods={foods} />
//     </>
//   );
// }

import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom"; // Make sure to import Link
import { useLocation, useParams } from "react-router-dom";
import { filterFoods, getAllTags, search } from "../../services/foodService";
import Thumbnails from "../../components/Thumbnails/Thumbnails";
import SearchBar from "../../components/Search/Search";
import Tags from "../../components/Tags/Tags";

import { db } from "../../services/firebase-config";

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

function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const location = useLocation();
  const { searchTerm } = useParams();

  // Modify handleTagClick to check for the "All" tag
  const handleTagClick = async (tagName) => {
    if (tagName === "All") {
      const allFoods = await filterFoods([], "All");
      dispatch({ type: "FOODS_LOADED", payload: allFoods });
    } else {
      const restrictions = location.state?.selectedRestrictions || [];
      const foodsFiltered = await filterFoods(restrictions, tagName);
      dispatch({ type: "FOODS_LOADED", payload: foodsFiltered });
    }
  };

  useEffect(() => {
    getAllTags().then((tagsData) => {
      dispatch({
        type: "TAGS_LOADED",
        payload: ["All", ...tagsData].map((tagName) => ({ name: tagName })), // Include "All" in the tag list
      });
    });

    const loadFoods = async () => {
      let foodsData;
      if (searchTerm) {
        foodsData = await search(searchTerm);
      } else {
        foodsData = await filterFoods([], "All");
      }
      dispatch({ type: "FOODS_LOADED", payload: foodsData });
    };

    loadFoods();
  }, [searchTerm, location.state]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
        }}
      >
        <Link
          to="/admin/setup"
          style={{
            padding: "10px 20px",
            fontSize: "1.2em",
            background: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,123,255,0.3)",
          }}
        >
          Administrator Login
        </Link>
      </div>
      <SearchBar onSearch={(term) => console.log(term)} />
      <Tags tags={tags} onTagClick={handleTagClick} />
      <Thumbnails foods={foods} />
    </>
  );
}

export default HomePage;
