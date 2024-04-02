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

// export default HomePage;
import React, { useEffect, useReducer } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  filterFoods, // Updated import to use the new filterFoods function
  getAllTags,
  search,
} from "../../services/foodService";
import Thumbnails from "../../components/Thumbnails/Thumbnails";
import SearchBar from "../../components/Search/Search";
import Tags from "../../components/Tags/Tags";

// No changes are needed for db setup, assuming it's correctly imported for Firestore queries
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

  const handleTagClick = async (tagName) => {
    // Include restrictions in the filterFoods function call
    const restrictions = location.state?.selectedRestrictions || [];
    const foodsFiltered = await filterFoods(restrictions, tagName);
    dispatch({ type: "FOODS_LOADED", payload: foodsFiltered });
  };


  useEffect(() => {
    // Always fetch and load tags
    getAllTags().then((tagsData) => {
      const tagsWithNames = tagsData.map((tagName) => ({ name: tagName }));
      dispatch({ type: "TAGS_LOADED", payload: tagsWithNames });
    });

    // Moved the logic for filtering inside useEffect
    const loadFoods = async () => {
      const restrictions = location.state?.selectedRestrictions || [];
      let foodsData;

      if(searchTerm) {
        // If there's a searchTerm, use it to search foods
        foodsData = await search(searchTerm);
      } else {
        // Use the filterFoods function to apply both dietary restrictions and tag filters
        foodsData = await filterFoods(restrictions, "All");
      }
      
      dispatch({ type: "FOODS_LOADED", payload: foodsData });
    };

    loadFoods();
  }, [searchTerm, location.state]);

  return (
    <>
      <SearchBar onSearch={(term) => console.log(term)} />
      <Tags tags={tags} onTagClick={handleTagClick} />
      <Thumbnails foods={foods} />
    </>
  );
}

export default HomePage;
