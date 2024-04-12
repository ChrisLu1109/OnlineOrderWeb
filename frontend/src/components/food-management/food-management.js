import React, { useState } from 'react';
import { addSampleFoodsToFirestore } from '../../services/firestoreService';
import { storage } from '../../services/firebase-config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

  const handleAllergyChange = (e) => {
    // Assuming allergies will be entered as comma-separated values
    const allergy = e.target.value.split(',').map(allergy => allergy.trim()); // Convert string to array
    setFood(prev => ({
      ...prev,
      allergy
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
      <input 
        type="text" 
        name="allergy" 
        value={food.allergy.join(', ')} // Convert array back to string for display
        onChange={handleAllergyChange} 
        placeholder="Allergies (comma-separated)" 
      />
      <input type="number" name="calories" value={food.calories} onChange={handleInputChange} placeholder="Calories" />
      <input type="file" onChange={(e) => setFood(prev => ({ ...prev, image: e.target.files[0] }))} />
      <button onClick={handleAddFood}>Add New Food Item to Firestore</button>
    </div>
  );
};

export default FoodManagement;
