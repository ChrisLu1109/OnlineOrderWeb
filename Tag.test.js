import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tags from './Tags'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

// Mock data for tags
const mockTags = [
  { name: 'peanut', count: 2 },
  { name: 'lunch', count: 1 },
  { name: 'dairy', count: 1 },
  { name: 'alcohol', count: 1 },
  { name: 'SlowFood', count: 1 },
];

describe('Tags Component', () => {
  // Test rendering of tags for the food page
  it('renders tags correctly for the food page', () => {
    render(
      <MemoryRouter>
        <Tags tags={mockTags} forFoodPage />
      </MemoryRouter>
    );
    
    // The container should have 'justifyContent: start' style
    expect(screen.getByRole('link', { name: /peanut/i }).closest('div')).toHaveStyle('justify-content: start;');

    // Check if all tags are rendered correctly without counts for the food page
    mockTags.forEach(tag => {
      expect(screen.getByRole('link', { name: new RegExp(tag.name, 'i') })).toBeInTheDocument();
      expect(screen.queryByText(`(${tag.count})`)).not.toBeInTheDocument();
    });
  });

  // Test rendering of tags for other pages
  it('renders tags correctly for other pages', () => {
    render(
      <MemoryRouter>
        <Tags tags={mockTags} forFoodPage={false} />
      </MemoryRouter>
    );

    // The container should have 'justifyContent: center' style
    expect(screen.getByRole('link', { name: /peanut/i }).closest('div')).toHaveStyle('justify-content: center;');

    // Check if all tags are rendered correctly with counts for other pages
    mockTags.forEach(tag => {
      expect(screen.getByRole('link', { name: new RegExp(`${tag.name}\\(${tag.count}\\)`, 'i') })).toBeInTheDocument();
    });
  });

  // Test if the correct href is assigned to each tag
  it('assigns the correct href to each tag', () => {
    render(
      <MemoryRouter>
        <Tags tags={mockTags} forFoodPage={false} />
      </MemoryRouter>
    );

    // Check if each Link leads to the correct path
    mockTags.forEach(tag => {
      expect(screen.getByRole('link', { name: new RegExp(tag.name, 'i') })).toHaveAttribute('href', `/tag/${tag.name}`);
    });
  });
});
