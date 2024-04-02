import React from "react";
import { Link } from "react-router-dom";
import classes from "./Tags.module.css";

export default function Tags({ tags, onTagClick }) {
  return (
    <div className={classes.container}>
      {tags.map((tag) => (
        // Change this from <Link> to <button> or <div> with an onClick event
        <button key={tag.name} onClick={() => onTagClick(tag.name)} className={classes.tagButton}>
          {tag.name}
        </button>
      ))}
    </div>
  );
}
