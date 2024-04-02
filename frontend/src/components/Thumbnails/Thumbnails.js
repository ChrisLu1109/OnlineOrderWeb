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
              src={`/foods/${food.imageURL}`}
              alt={food.name}
            />
            <div className={classes.content}>
              <div className={classes.name}>{food.name}</div>
              <div className={classes.calories}>{food.calories} calories</div>
              {food.favorite && <span className={classes.favorite}>♥</span>}
              <div className={classes.tags}>
                {food.tags.map((tag) => (
                  <span key={tag} className={classes.tagButton}>{tag}</span>
                ))}
                <span className={classes.cookTime}>Cook Time: {food.cookTime} Mins</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
