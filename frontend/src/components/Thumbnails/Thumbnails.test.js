import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Thumbnails from './Thumbnails'; // Make sure the path to your Thumbnails component is correct

// Mock data for the foods prop
const mockFoods = [
  {
    id: '1',
    name: 'Apple',
    calories: '95 kcal',
    favorite: true,
    imageURL: 'apple.jpg',
    allergy: ['none'],
    cookTime: '0 mins'
  },
  {
    id: '2',
    name: 'Banana',
    calories: '105 kcal',
    favorite: false,
    imageURL: 'banana.jpg',
    allergy: ['none'],
    cookTime: '0 mins'
  },
  // Add more items as needed for thorough testing
];

describe('Thumbnails Component', () => {
  beforeEach(() => {
    // Render Thumbnails before each test
    render(
      <MemoryRouter>
        <Thumbnails foods={mockFoods} />
      </MemoryRouter>
    );
  });

  it('renders a list of food items with images, names, calories, favorites, and details', () => {
    mockFoods.forEach(food => {
      expect(screen.getByText(food.name)).toBeInTheDocument();
      expect(screen.getByText(food.calories)).toBeInTheDocument();
      const cookTimeElement = screen.getByText((content, element) => 
        element.tagName.toLowerCase() === 'div' && content.includes(`Cook Time:`)
      );
      expect(cookTimeElement).toBeInTheDocument();
      expect(screen.getByRole('img', { name: food.name })).toHaveAttribute('src', `/foods/${food.imageURL}`);

      const favoriteIcon = screen.getByText('♥', { selector: 'span' });
      expect(favoriteIcon).toHaveClass(food.favorite ? 'favorite' : 'not');
    });
  });

  it('has correct links to individual food pages', () => {
    mockFoods.forEach(food => {
      const foodLink = screen.getByRole('link', { name: new RegExp(food.name, 'i') });
      expect(foodLink).toHaveAttribute('href', `/food/${food.id}`);
    });
  });

  it('displays the correct allergy information for each food', () => {
    mockFoods.forEach(food => {
      food.allergy.forEach(allergy => {
        const allergyElements = screen.getAllByText(allergy);
        expect(allergyElements).not.toHaveLength(0); // It should find the elements, hence not zero length
      });
    });
  });
});
