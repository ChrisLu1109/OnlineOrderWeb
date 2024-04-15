import React, { useState } from 'react';
import { addSampleFoodsToFirestore } from '../../services/firestoreService';
import { storage } from '../../services/firebase-config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
const FoodManagement = () => {
  const [food, setFood] = useState({
    id: "",
    name: "",
    cookTime: "",
    favorite: false,
    tags: [],
    allergy: [],
    calories: 0,
    image: null,
    dietaryRestrictions: {
      "Dairy-Free": false,
      "Gluten-Free": false,
      "Halal": false,
      "Keto": false,
      "Kosher": false,
      "Lacto-ovo vegetarian": false,
      "Lacto-vegetarian": false,
      "Low Calories": false,
      "Low Sodium": false,
      "Low Sugar": false,
      "None": true,
      "Nut-Free": false,
      "Ovo-vegetarian": false,
      "Pescatarian": false,
      "Vegan": false,
    },
  });

  const uploadImage = async (image) => {
    if (!image) {
      throw new Error('No image file selected');
    }
    const storageRef = ref(storage, `foods/${image.name}`);
    await uploadBytes(storageRef, image);
    return getDownloadURL(storageRef);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFood((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    setFood((prev) => ({
      ...prev,
      favorite: e.target.checked
    }));
  };

  const handleTagsChange = (e) => {
    // Assuming tags will be entered as comma-separated values
    const tags = e.target.value.split(',').map(tag => tag.trim()); // Convert string to array
    setFood(prev => ({
      ...prev,
      tags
    }));
  };


  const handleAddFood = async () => {
    try {
      // First, check if an image has been selected
      if (!food.image) {
        throw new Error('No image selected');
      }
      
      // Upload the image and get the URL
      const imageUrl = await uploadImage(food.image);
  
      // Construct the foodData object without the File object
      // Make sure to spread the previous food state, and overwrite the `image` field with the URL string
      const { image, ...foodDataWithoutImage } = food;
      const foodData = {
        ...foodDataWithoutImage,
        imageURL: imageUrl,
      };
  
      // Proceed to add the new food item to Firestore
      await addSampleFoodsToFirestore(foodData);
  
      // Notify the user
      alert('New food item has been added to Firestore.');
      // Reset the form here, if necessary
    } catch (error) {
      console.error('Error adding new food item to Firestore:', error);
      alert('Error adding new food item to Firestore. Check the console for more information.');
    }
  };

  const handleDietaryRestrictionsChange = (e) => {
    const { name, checked } = e.target;
    setFood((prevFood) => ({
      ...prevFood,
      dietaryRestrictions: {
        ...prevFood.dietaryRestrictions,
        [name]: checked,
      }
    }));
  };
  

  return (
    <div>
      <input type="text" name="id" value={food.id} onChange={handleInputChange} placeholder="ID" />
      <input type="text" name="name" value={food.name} onChange={handleInputChange} placeholder="Name" />
      <input type="text" name="cookTime" value={food.cookTime} onChange={handleInputChange} placeholder="Cook Time" />
      <input type="checkbox" name="favorite" checked={food.favorite} onChange={handleCheckboxChange} />
      <input 
        type="text" 
        name="tags" 
        value={food.tags.join(', ')} // Convert array back to string for display
        onChange={handleTagsChange} 
        placeholder="Tags (comma-separated)" 
      />
      {Object.keys(food.dietaryRestrictions).map((restriction) => (
  <div key={restriction}>
    <input
      type="checkbox"
      id={restriction}
      name={restriction}
      checked={food.dietaryRestrictions[restriction]}
      onChange={handleDietaryRestrictionsChange}
    />
    <label htmlFor={restriction}>{restriction.replace(/([A-Z])/g, ' $1').trim()}</label>
  </div>
))}
      <input type="number" name="calories" value={food.calories} onChange={handleInputChange} placeholder="Calories" />
      <input type="file" onChange={(e) => setFood(prev => ({ ...prev, image: e.target.files[0] }))} />
      <button onClick={handleAddFood}>Add New Food Item to Firestore</button>
      <Link to="/view-food"><button>View Existing Food Items</button></Link>
      <Link to="/admin/setup"><button>Back</button></Link>
    </div>
  );
};

export default FoodManagement;
