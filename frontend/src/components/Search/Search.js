import React, { useState } from "react";
import classes from "./Search.module.css";

export default function Search({ onSearch }) {
  const [term, setTerm] = useState("");

  const handleSearch = () => {
    onSearch(term); // Pass the term back to the parent component
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={classes.container}>
      <input
        type="text"
        placeholder="Enter the item name to search"
        className={classes.input}
        onChange={(e) => setTerm(e.target.value)}
        onKeyUp={handleKeyUp}
        value={term}
      />
      <button className={classes.button} onClick={handleSearch}>Search</button>
    </div>
  );
}
