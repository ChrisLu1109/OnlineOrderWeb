import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import './FoodList.css';
import { Link } from 'react-router-dom';

const FoodList = () => {
  const [foods, setFoods] = useState([]);

  // Function to fetch foods from Firestore
  const fetchFoods = async () => {
    const querySnapshot = await getDocs(collection(db, "foods"));
    const foodsArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setFoods(foodsArray);
  };

  // Function to delete a food item
  const deleteFoodItem = async (id) => {
    await deleteDoc(doc(db, "foods", id));
    fetchFoods();
  };

  // Function to update food item
  const updateFoodItem = async (id, updatedFields) => {
    const foodRef = doc(db, "foods", id);
    await updateDoc(foodRef, updatedFields);
    fetchFoods();
  };

  // Function to handle form changes
  const handleFormChange = (event, id) => {
    const { name, value, type, checked } = event.target;
    setFoods(foods.map(food => {
      if (food.id === id) {
        if (type === 'checkbox') {
          food.dietaryRestrictions[name] = checked;
        } else {
          food[name] = value;
        }
      }
      return food;
    }));
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div>
      <h1>Food List</h1>
      {foods.map((food) => (
        <div className="food-item" key={food.id}>
          <h2 className="food-title">{`${food.name} (ID: ${food.id})`}</h2> 
          <form onSubmit={(e) => {
            e.preventDefault();
            updateFoodItem(food.id, food);
          }}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={food.name}
                onChange={(e) => handleFormChange(e, food.id)}
              />
            </label>
            <label>
              Cook Time:
              <input
                type="text"
                name="cookTime"
                value={food.cookTime}
                onChange={(e) => handleFormChange(e, food.id)}
              />
            </label>
            <label>
              Calories:
              <input
                type="number"
                name="calories"
                value={food.calories}
                onChange={(e) => handleFormChange(e, food.id)}
              />
            </label>
            <div className="food-details">
              {Object.keys(food.dietaryRestrictions).map(restriction => (
                <label key={restriction}>
                  {restriction}
                  <input
                    type="checkbox"
                    name={restriction}
                    checked={food.dietaryRestrictions[restriction]}
                    onChange={(e) => handleFormChange(e, food.id)}
                  />
                </label>
              ))}
            </div>
            <button type="submit">Update Details</button>
          </form>
          <button onClick={() => deleteFoodItem(food.id)}>Delete</button>
        </div>
      ))}
      <Link to="/food-management"><button>Back to add</button></Link>
    </div>
  );
};

export default FoodList;
