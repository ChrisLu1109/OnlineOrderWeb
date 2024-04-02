import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tags from './Tags'; // Adjust the import path as necessary

// Mock data for tags
const mockTags = [
  { name: 'peanut', count: 2 },
  { name: 'lunch', count: 1 },
  { name: 'dairy', count: 1 },
  { name: 'alcohol', count: 1 },
  { name: 'SlowFood', count: 1 },
];

describe('Tags Component', () => {
  // Test rendering of tags
  it('renders tags correctly', () => {
    const onTagClick = jest.fn(); // Mock onTagClick function
    render(<Tags tags={mockTags} onTagClick={onTagClick} />);
    
    // Check if all tags are rendered correctly
    mockTags.forEach(tag => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    });
  });

  // Test if onTagClick is called with the correct argument
  it('calls onTagClick with the correct tag name', () => {
    const onTagClick = jest.fn(); // Mock onTagClick function
    render(<Tags tags={mockTags} onTagClick={onTagClick} />);
    
    // Simulate clicking the first tag
    const firstTagName = mockTags[0].name;
    fireEvent.click(screen.getByText(firstTagName));
    
    // Check if onTagClick was called with the correct tag name
    expect(onTagClick).toHaveBeenCalledWith(firstTagName);
  });
});
