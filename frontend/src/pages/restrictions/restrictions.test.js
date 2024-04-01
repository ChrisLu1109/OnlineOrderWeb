import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './restrictions'; // Adjust the import path according to your project structure
import { BrowserRouter } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import * as firebaseConfig from '../../services/firebase-config'; // Ensure this matches the actual import
import { waitFor } from '@testing-library/react';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn().mockReturnValue({
    // Mock return for doc reference
  }),
  updateDoc: jest.fn(),
}));

// Mock Firebase Auth
jest.mock('../../services/firebase-config', () => ({
  auth: {
    currentUser: {
      uid: 'testUserId'
    }
  },
  db: {}
}));

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    // Clear all mock function calls between tests
    mockedNavigate.mockReset();
    updateDoc.mockReset();
  });

  test('allows the user to enter search terms and select restrictions', async () => {
    updateDoc.mockResolvedValueOnce(); // Ensure updateDoc is mocked to resolve
    const handleSearchMock = jest.fn();
    render(
      <BrowserRouter>
        <SearchBar onSearch={handleSearchMock} />
      </BrowserRouter>
    );

    // Check if the input is rendered
    const inputElement = screen.getByPlaceholderText('Dietary Restrictions');
    expect(inputElement).toBeInTheDocument();

    // Simulate user typing in the search bar
    fireEvent.change(inputElement, { target: { value: 'Vegan' } });
    expect(inputElement.value).toBe('Vegan');
    expect(handleSearchMock).toHaveBeenCalledWith('Vegan');

    // Simulate user selecting a restriction
    const restrictionButton = screen.getByText('Vegan');
    fireEvent.click(restrictionButton);

    // Confirm the user's selection
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    // Check that Firestore's updateDoc was called correctly
    expect(updateDoc).toHaveBeenCalled();
    // Check if the navigate function was called to redirect the user
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('handles user not logged in', async () => {
    // Reset auth.currentUser to null for this test
    firebaseConfig.auth.currentUser = null;
    updateDoc.mockResolvedValueOnce(); // This should not be called

    const handleSearchMock = jest.fn();
    render(
      <BrowserRouter>
        <SearchBar onSearch={handleSearchMock} />
      </BrowserRouter>
    );

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    // Use waitFor to allow any promises to resolve and state updates to occur
    await waitFor(() => {
      // Assert that the correct behavior occurs
      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  test('handles error during Firestore update', async () => {
  // Set up the mock to reject this time
  updateDoc.mockRejectedValueOnce(new Error('Update failed'));

  const handleSearchMock = jest.fn();
  render(
    <BrowserRouter>
      <SearchBar onSearch={handleSearchMock} />
    </BrowserRouter>
  );

  const restrictionButton = screen.getByText('Vegan');
  fireEvent.click(restrictionButton);

  const confirmButton = screen.getByText('Confirm');
  fireEvent.click(confirmButton);

  // Assuming your component updates some state and then shows an error message,
  // you should use waitFor to catch these changes.
  await waitFor(() => {
    // Check whether an error message "Error updating user allergies" is shown on the screen
    const errorMessage = screen.queryByText('Error updating user allergies');
    expect(errorMessage).toBeInTheDocument();

    });
});


  // Add more tests as necessary to cover other interactions and edge cases
});
