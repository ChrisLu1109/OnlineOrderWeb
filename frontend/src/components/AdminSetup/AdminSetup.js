import React from 'react';
import { addSampleFoodsToFirestore, addSampleTagsToFirestore, deleteDuplicateFoods } from '../../services/firestoreService';
import { sample_foods, sample_tags } from '../../data'; // assuming data.js is at this path

const AdminSetup = () => {
  const handleAddSampleFoods = async () => {
    try {
      for (const food of sample_foods) {
        await addSampleFoodsToFirestore(food);
      }
      alert('All sample foods have been added to Firestore.');
    } catch (error) {
      console.error('Error adding sample foods to Firestore:', error);
      alert('Error adding sample foods to Firestore. Check the console for more information.');
    }
  };

  const handleAddSampleTags = async () => {
    try {
      for (const tag of sample_tags) {
        await addSampleTagsToFirestore(tag);
      }
      alert('All sample tags have been added to Firestore.');
    } catch (error) {
      console.error('Error adding sample tags to Firestore:', error);
      alert('Error adding sample tags to Firestore. Check the console for more information.');
    }
  };

  const handleDeleteDuplicates = async () => {
    try {
      await deleteDuplicateFoods();
      alert('Duplicate foods have been deleted from Firestore.');
    } catch (error) {
      console.error('Error deleting duplicate foods from Firestore:', error);
      alert('Error deleting duplicate foods from Firestore. Check the console for more information.');
    }
  };

  return (
    <div>
      <button onClick={handleAddSampleFoods}>Add Sample Foods to Firestore</button>
      <button onClick={handleAddSampleTags}>Add Sample Tags to Firestore</button>
      <button onClick={handleDeleteDuplicates}>Delete Duplicate Foods</button>
    </div>
  );
};

export default AdminSetup;
