import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import './FoodList.css';
import { Link } from 'react-router-dom';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [newTags, setNewTags] = useState({});

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
  const addTag = (id) => {
    const newTag = newTags[id] || '';
    if (newTag.trim()) {
      setFoods(foods.map(food => {
        if (food.id === id) {
          // Avoid adding duplicate tags
          if (!food.tags.includes(newTag.trim())) {
            return { ...food, tags: [...food.tags, newTag.trim()] };
          }
        }
        return food;
      }));
      setNewTags({ ...newTags, [id]: '' }); // Reset the input for new tag
    }
  };

  // Function to handle deleting a tag
  const deleteTag = (id, tagToDelete) => {
    setFoods(foods.map(food => {
      if (food.id === id) {
        return { ...food, tags: food.tags.filter(tag => tag !== tagToDelete) };
      }
      return food;
    }));
  };

  const handleNewTagChange = (e, id) => {
    setNewTags({ ...newTags, [id]: e.target.value });
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
            <div className="tags-container">
            {food.tags.map((tag, index) => (
              <div key={index} className="tag">
                {tag}
                <button type="button" onClick={() => deleteTag(food.id, tag)} className="delete-tag-btn">x</button>
              </div>
            ))}
            <input
              type="text"
              value={newTags[food.id] || ''}
              onChange={(e) => handleNewTagChange(e, food.id)}
              placeholder="New tag"
            />
            <button type="button" onClick={() => addTag(food.id)} className="add-tag-btn">
              Add Tag
            </button>
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
