import { db } from './firebase-config';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { sample_foods, sample_tags } from '../data';


export const addSampleFoodsToFirestore = async () => {
  const foodCollectionRef = collection(db, "foods");

  for (const food of sample_foods) {
    await addDoc(foodCollectionRef, food);
  }
};

export const addSampleTagsToFirestore = async () => {
  const tagsCollectionRef = collection(db, "tags");

  for (const tag of sample_tags) {
    await addDoc(tagsCollectionRef, tag);
  }
};


export const deleteDuplicateFoods = async () => {
    const foodsCollectionRef = collection(db, "foods");
    const foodsSnapshot = await getDocs(foodsCollectionRef);
    const foodItems = foodsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    // This map will track the first occurrence of each food by name
    const foodMap = new Map();
  
    // Identifying duplicates
    const duplicates = [];
    foodItems.forEach((foodItem) => {
      if (foodMap.has(foodItem.name)) {
        // If we've seen this name before, it's a duplicate
        duplicates.push(foodItem.id);
      } else {
        // Otherwise, mark this name as seen
        foodMap.set(foodItem.name, foodItem.id);
      }
    });
  
    // Deleting duplicates
    const deletePromises = duplicates.map((duplicateId) => {
      const foodDocRef = doc(db, "foods", duplicateId);
      return deleteDoc(foodDocRef);
    });
  
    // Wait for all delete operations to complete
    await Promise.all(deletePromises);
  
    console.log(`Deleted ${duplicates.length} duplicate food items.`);
  };
