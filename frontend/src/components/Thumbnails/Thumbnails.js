import React from "react";
import classes from "./Thumbnails.module.css";
import { Link } from "react-router-dom";

export default function Thumbnails({ foods }) {
  return (
    <ul className={classes.list}>
      {foods.map((food) => (
        <li key={food.id} className={classes.item}>
          <Link to={`/food/${food.id}`} className={classes.link}>
            <img
              className={classes.image}
              src={food.imageURL} // Assuming imageURL is a full URL
              alt={food.name}
              onError={(e) => { e.target.onerror = null; e.target.src = "path_to_default_image.jpg"; }} // Fallback for broken images
            />
            <div className={classes.content}>
              <div className={classes.name}>{food.name}</div>
              <div className={classes.calories}>{food.calories} calories</div>
              {food.favorite && <span className={classes.favorite}>♥</span>}
              <div className={classes.tags}>
                {food.tags && food.tags.map((tag) => (
                  <span key={tag} className={classes.tagButton}>{tag}</span>
                ))}
                {food.cookTime && <span className={classes.cookTime}>Cook Time: {food.cookTime}</span>}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
