// Search.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search'; // Adjust this import based on your file structure
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useParams: () => ({ searchTerm: 'initial' }),
}));

describe('Search Component Tests', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/search/initial']}>
        <Routes>
          <Route path="/search/:searchTerm" element={<Search />} />
        </Routes>
      </MemoryRouter>
    );
  });

  it('updates input field based on user input', async () => {
    const inputField = screen.getByPlaceholderText('Enter the item name to search');
    await userEvent.type(inputField, 'chicken');
    
    expect(inputField.value).toBe('initialchicken'); // Since 'initial' is set by useParams
  });

  it('navigates to the correct path when search is triggered', async () => {
    const searchButton = screen.getByRole('button', { name: /search/i });
    const inputField = screen.getByPlaceholderText('Enter the item name to search');
    await userEvent.clear(inputField);
    await userEvent.type(inputField, 'chicken');
    await userEvent.click(searchButton);
    
    expect(mockUseNavigate).toHaveBeenCalledWith('/search/chicken');
  });

  it('navigates to home if search term is empty and search is triggered', async () => {
    const searchButton = screen.getByRole('button', { name: /search/i });
    const inputField = screen.getByPlaceholderText('Enter the item name to search');
    await userEvent.clear(inputField); // Clearing the initial value
    await userEvent.click(searchButton);
    
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
  });

  it('triggers search on Enter key press', async () => {
    const inputField = screen.getByPlaceholderText('Enter the item name to search');
    await userEvent.clear(inputField);
    await userEvent.type(inputField, 'chicken{enter}');

    expect(mockUseNavigate).toHaveBeenCalledWith('/search/chicken');
  });


});
