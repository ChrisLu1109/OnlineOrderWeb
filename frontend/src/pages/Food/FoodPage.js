import React from "react";
import classes from "./foodPage.module.css"
import { useState } from "react";
import { useParams } from "react-router-dom/dist";
import { useEffect } from "react";
import { getById } from "../../services/foodService";
import Tags from "../../components/Tags/Tags";

export default function FoodPage(){
    const [food, setfood] = useState({});
    const {id} = useParams();

    useEffect(() => {
        getById(id).then((fetchedFood) => {
            setfood(fetchedFood);
            console.log(fetchedFood); // This will log the food object to verify the imageUrl
        });
    }, [id]);
    return( 
    <>
    {food && (
    <div className= {classes.container}>
        <img 
            className= {classes.image}
            src={`/foods/${food.imageURL}`}
            alt = {food.name}
        />

        <div className= {classes.details}>
            <div className={classes.header}>
                <span className={classes.name}>{food.name}</span>
                <span className={`${classes.favorite} ${food.favorite? '':classes.not}`}>
                
                </span>
            </div>
            
            <div className={classes.origins}>
              {food.origins?.map(origin => (
                <span key={origin}>{origin}</span>
              ))}
            </div>

            <div className={classes.tags}>
              {food.tags && (
                <Tags
                  tags={food.tags.map(tag => ({ name: tag }))}
                  forFoodPage={true}
                />
              )}
            </div>

            <div className={classes.cook_time}>
              <span>
                Time to cook about <strong>{food.cookTime}</strong> minutes
              </span>
            </div>


            <button >Add To Cart</button>



        </div>

    </div>
    )}</>
    )
}