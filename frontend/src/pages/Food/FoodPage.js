// import React from "react";
// import classes from "./foodPage.module.css";
// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom/dist";
// import { useEffect } from "react";
// import { getById } from "../../services/foodService";
// import Tags from "../../components/Tags/Tags";
// import { useCart } from "../../hooks/useCart";

// export default function FoodPage() {
//   const [food, setfood] = useState({});
//   const { id } = useParams();
//   const { addToCart } = useCart();
//   const navigate = useNavigate();

//   const handleAddToCart = () => {
//     addToCart(food);
//     navigate("/cart");
//   };

//   // debug use only
//   useEffect(() => {
//     getById(id)
//       .then((fetchedFood) => {
//         if (fetchedFood) {
//           setfood(fetchedFood);
//         } else {
//           // handle the case when the food item does not exist
//           console.log("Food item not found");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching food item:", error);
//       });
//   }, [id]);

//   useEffect(() => {
//     getById(id).then((fetchedFood) => {
//       setfood(fetchedFood);
//       console.log(fetchedFood); // This will log the food object to verify the imageUrl
//     });
//   }, [id]);

//   return (
//     <>
//       {food && (
//         <div className={classes.container}>
//           <img
//             className={classes.image}
//             src={`/foods/${food.imageURL}`}
//             alt={food.name}
//           />

//           <div className={classes.details}>
//             <div className={classes.header}>
//               <span className={classes.name}>{food.name}</span>
//               <span
//                 className={`${classes.favorite} ${
//                   food.favorite ? "" : classes.not
//                 }`}
//               ></span>
//             </div>

//             <div className={classes.origins}>
//               {food.origins?.map((origin) => (
//                 <span key={origin}>{origin}</span>
//               ))}
//             </div>

//             <div className={classes.tags}>
//               {food.tags && (
//                 <Tags
//                   tags={food.tags.map((tag) => ({ name: tag }))}
//                   forFoodPage={true}
//                 />
//               )}
//             </div>

//             <div className={classes.cook_time}>
//               <span>
//                 Time to cook about <strong>{food.cookTime}</strong> minutes
//               </span>
//             </div>

//             <button onClick={handleAddToCart}>Add To Cart</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById } from '../../services/foodService';
import Tags from '../../components/Tags/Tags';
import { useCart } from '../../hooks/useCart';
import classes from './foodPage.module.css';

export default function FoodPage() {
  const [food, setFood] = useState(null); // Initialize food as null
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    getById(id)
      .then((fetchedFood) => {
        if (fetchedFood) {
          setFood(fetchedFood);
        } else {
          navigate('/'); // Navigate to the homepage if the food item is not found
        }
      })
      .catch((error) => {
        console.error('Error fetching food item:', error);
        navigate('/'); // Navigate to the homepage in case of error
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(food);
    navigate('/cart');
  };

  if (!food) { // Only render the component if food is not null
    return <div>Loading...</div>; // Render a loading state or spinner here
  }

  return (
    <div className={classes.container}>
      <img
        className={classes.image}
        src={food.imageURL} 
        alt={food.name}
      />

      <div className={classes.details}>
        <div className={classes.header}>
          <span className={classes.name}>{food.name}</span>
          <span className={`${classes.favorite} ${food.favorite ? '' : classes.notFavorite}`}></span>
        </div>

        <div className={classes.origins}>
          {food.origins?.map((origin) => (
            <span key={origin}>{origin}</span>
          ))}
        </div>

        <div className={classes.tags}>
          <Tags
            tags={food.tags?.map((tag) => ({ name: tag }))}
            forFoodPage={true}
          />
        </div>

        <div className={classes.cook_time}>
          <span>
            Time to cook about <strong>{food.cookTime}</strong> minutes
          </span>
        </div>

        <button onClick={handleAddToCart}>Add To Cart</button>
      </div>
    </div>
  );
}
