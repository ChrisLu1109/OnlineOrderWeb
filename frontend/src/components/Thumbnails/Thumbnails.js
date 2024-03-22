import React from "react";
import classes from "./Thumbnails.module.css";
import { Link } from "react-router-dom";

export default function Thumbnails({ foods }) {
  return (
    <ul className={classes.list}>
      {foods.map((food) => (
        <li key={food.id}>
          <Link to={`/food/${food.id}`}>
            <img
              className={classes.image}
              src={`/foods/${food.imageURL}`}
              alt={food.name}
            />
            <div className={classes.content}>
              <div className={classes.name}>{food.name}</div>
              <span className={food.favorite ? classes.favorite : classes.not}>
                ♥
              </span>
              <div className={classes.product_item_footer}>
                <div className={classes.allergy}>
                  {food.allergy.map((allergy) => (
                    <span key={allergy}>{allergy}</span>
                  ))}
                </div>
                <div className={classes.cook_time}>
                  <span>Cook Time: </span>
                  {food.cookTime}
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
