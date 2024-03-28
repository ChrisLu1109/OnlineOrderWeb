import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import { auth } from '../../services/firebase-config';

// Mocking useNavigate hook from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import and retain the original functionality
  useNavigate: () => mockedNavigate,
}));

// Mocking useCart hook
jest.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    cart: { totalCount: 3 } // Example cart item count
  }),
}));

// Mocking Firebase Auth
jest.mock('../../services/firebase-config', () => ({
  auth: {
    onAuthStateChanged: jest.fn(callback => {
      callback({ displayName: 'Test User', email: 'test@example.com' }); // Mock logged-in user
      return jest.fn(); // Return a mock unsubscribe function
    }),
    signOut: jest.fn().mockResolvedValue(), // Mock signOut to resolve
  },
}));

describe('Header component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it('displays the user name when logged in', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Using the displayName from the mocked Firebase auth state
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('navigates to home page on logout', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    fireEvent.click(screen.getByText(/logout/i));
    
    await waitFor(() => {
      expect(auth.signOut).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith('/'); // Assuming home page is the root path
    });
  });

  it('shows the login link when not authenticated', async () => {
    // Adjusting mock to simulate no authenticated user
    auth.onAuthStateChanged.mockImplementationOnce(callback => {
      callback(null);
      return jest.fn(); // Return a mock unsubscribe function
    });

    render(
      <Router>
        <Header />
      </Router>
    );

    // Check for login link when no user is authenticated
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    // Verifying cart link exists regardless of authentication state
    expect(screen.getByText(/cart/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Mocked cart total count
  });
});
