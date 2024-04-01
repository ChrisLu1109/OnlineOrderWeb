// // import React, { useEffect, useReducer } from "react";
// // import {
// //   getAll,
// //   search,
// //   getAllTags,
// //   getAllByTag,
// //   addFoodItem,
// // } from "../../services/foodService";
// // import Thumbnails from "../../components/Thumbnails/Thumbnails";
// // import { useParams } from "react-router-dom";
// // import Search from "../../components/Search/Search";
// // import Tags from "../../components/Tags/Tags";

// // const initialState = { foods: [], tags: [] };

// // const reducer = (state, action) => {
// //   switch (action.type) {
// //     case "FOODS_LOADED":
// //       return { ...state, foods: action.payload };
// //     case "TAGS_LOADED":
// //       return { ...state, tags: action.payload };
// //     default:
// //       return state;
// //   }
// // };

// // export default function HomePage() {
// //   const [state, dispatch] = useReducer(reducer, initialState);
// //   const { foods, tags } = state;
// //   const { searchTerm, tag } = useParams();

// //   useEffect(() => {
// //     getAllTags().then((tags) =>
// //       dispatch({ type: "TAGS_LOADED", payload: tags })
// //     );

// //     const foodPromise = tag
// //       ? getAllByTag(tag)
// //       : searchTerm
// //       ? search(searchTerm)
// //       : getAll();

// //     foodPromise.then((foods) => {
// //       dispatch({ type: "FOODS_LOADED", payload: foods });
// //     });
// //   }, [searchTerm, tag]);

// //   // Test function to add a food item
// //   const handleAddTestFood = async () => {
// //     const testFoodItem = {
// //       name: "Test Food",
// //       imageUrl: "http://example.com/image.jpg",
// //       calories: 500,
// //       cooktime: "20min",
// //       favorite: false,
// //       allergy: ["Nuts"],
// //     };

// //     try {
// //       await addFoodItem(testFoodItem);
// //       alert("Test food item added successfully!");
// //     } catch (error) {
// //       console.error("Error adding test food item: ", error);
// //       alert("Error adding test food item.");
// //     }
// //   };

// //   return (
// //     <>
// //       <Search />
// //       <Tags tags={tags} />
// //       <Thumbnails foods={foods} />
// //       {/* Add a button to trigger the test food item addition */}
// //       <button onClick={handleAddTestFood}>Add Test Food Item</button>
// //     </>
// //   );
// // }


// import React, { useEffect, useReducer } from 'react';
// import { useLocation } from 'react-router-dom'; // Used to get the current URL query params
// import { parse } from 'query-string'; // Parse query params from the URL

// import {
//   getAll,
//   // Replace 'searchByRestrictions' with the actual function name from your services
//   searchByRestrictions, 
// } from '../../services/foodService';
// import Thumbnails from '../../components/Thumbnails/Thumbnails';
// import SearchBar from '../../components/Search/SearchBar'; // Assuming this is the right path
// import Tags from '../../components/Tags/Tags';

// const initialState = { foods: [], tags: [] };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FOODS_LOADED':
//       return { ...state, foods: action.payload };
//     case 'TAGS_LOADED':
//       return { ...state, tags: action.payload };
//     default:
//       return state;
//   }
// };

// export default function HomePage() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { foods, tags } = state;
//   const location = useLocation(); // Access the location object

//   useEffect(() => {
//     getAllTags().then((tags) =>
//       dispatch({ type: 'TAGS_LOADED', payload: tags })
//     );

//     // This effect runs whenever the URL changes.
//     // When the URL query params change, it will parse them and
//     // make a new search with the selected restrictions.
//     const query = parse(location.search); // Parse the URL query params
//     const restrictions = query.restrictions ? query.restrictions.split(',') : [];

//     // Replace 'searchByRestrictions' with your actual search function that
//     // accepts an array of restrictions.
//     searchByRestrictions(restrictions).then((foods) => {
//       dispatch({ type: 'FOODS_LOADED', payload: foods });
//     });

//   }, [location]); // Run this effect when location changes.

//   // The rest of your component renders as normal.
//   return (
//     <>
//       <SearchBar onSearch={(term) => console.log(term)} />
//       <Tags tags={tags} />
//       <Thumbnails foods={foods} />
//     </>
//   );
// }
import React, { useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getFoodsByDietaryRestrictions,
  getAllTags,
} from '../../services/foodService';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import SearchBar from '../../components/Search/Search'; // Adjust if necessary
import Tags from '../../components/Tags/Tags';

// Assuming db setup is correctly imported for your Firestore queries
import { db } from '../../services/firebase-config';

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const location = useLocation();

  useEffect(() => {
    // Fetch all unique tags for filtering options
    getAllTags().then((tagsData) =>
      dispatch({ type: 'TAGS_LOADED', payload: tagsData })
    );

    // Fetch foods based on selected dietary restrictions
    // Assuming `location.state.selectedRestrictions` holds our array of restrictions
    const restrictions = location.state?.selectedRestrictions || [];

    getFoodsByDietaryRestrictions(restrictions).then((foodsData) => {
      dispatch({ type: 'FOODS_LOADED', payload: foodsData });
    });
  }, [location.state]); // Reacting to changes in location.state to refetch data

  return (
    <>
      <SearchBar onSearch={(term) => console.log(term)} />
      <Tags tags={tags} />
      <Thumbnails foods={foods} />
    </>
  );
}

export default HomePage;
