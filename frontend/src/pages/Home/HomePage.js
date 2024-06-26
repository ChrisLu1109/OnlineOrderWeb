import React, { useEffect, useReducer } from "react";
import { Link, useLocation } from "react-router-dom";
import { filterFoods, getAllTags, search as searchFoods } from "../../services/foodService";
import Thumbnails from "../../components/Thumbnails/Thumbnails";
import SearchBar from "../../components/Search/Search";
import Tags from "../../components/Tags/Tags";

const initialState = {
  foods: [],
  tags: [],
  selectedTag: 'All',
  searchTerm: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FOODS":
      return { ...state, foods: action.payload };
    case "LOAD_TAGS":
      return { ...state, tags: action.payload };
    case "SET_TAG":
      // Reset the search term when a new tag is selected
      return { ...state, selectedTag: action.payload, searchTerm: '' };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags, selectedTag, searchTerm } = state;
  const location = useLocation();

  // Fetch all tags on component mount
  useEffect(() => {
    getAllTags().then(tags => {
      dispatch({ type: "LOAD_TAGS", payload: tags.map(tag => ({ name: tag })) });
    });
  }, []);

  // Fetch foods based on the primary condition of dietary restrictions, then search term or tag
  useEffect(() => {
    const restrictions = location.state?.selectedRestrictions || [];
    const fetchFoods = async () => {
      let filteredFoods = await filterFoods(restrictions); // Always apply dietary restrictions first

      // Apply secondary filters based on search term or tag if necessary
      if (searchTerm) {
        filteredFoods = await searchFoods(searchTerm); // Further filter by search term if present
      } else if (selectedTag !== 'All') {
        filteredFoods = filteredFoods.filter(food => food.tags?.includes(selectedTag)); // Further filter by tag if selected
      }

      dispatch({ type: "LOAD_FOODS", payload: filteredFoods });
    };

    fetchFoods();
  }, [location.state, searchTerm, selectedTag]);

  const handleTagClick = tagName => {
    dispatch({ type: "SET_TAG", payload: tagName });
  };

  const handleSearch = term => {
    dispatch({ type: "SET_SEARCH_TERM", payload: term });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
        <Link to="/admin/setup" style={{
          padding: "10px 20px",
          fontSize: "1.2em",
          background: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,123,255,0.3)"
        }}>
          Administrator Login
        </Link>
      </div>
      <SearchBar onSearch={handleSearch} />
      <Tags tags={tags} onTagClick={handleTagClick} />
      <Thumbnails foods={foods} />
    </>
  );
}

export default HomePage;
