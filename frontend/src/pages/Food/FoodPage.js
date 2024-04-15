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

        <button style={{ backgroundColor: '#ffa500' }} onClick={handleAddToCart}>Add To Cart</button>
      </div>
    </div>
  );
}
