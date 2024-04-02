// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import Profile from './profile'; // Adjust the import path according to your project structure
// import { BrowserRouter } from 'react-router-dom';
// import { auth } from '../../services/firebase-config';

// // Mocking useNavigate
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => jest.fn()
// }));

// // Mocking Firebase auth signOut
// jest.mock('../../services/firebase-config', () => ({
//     auth: {
//         currentUser: {
//             email: 'test@example.com'
//         }
//     },
//     signOut: jest.fn(() => Promise.resolve('Signed out')),
// }));

// jest.mock('firebase/auth', () => ({
//     ...jest.requireActual('firebase/auth'),
//     signOut: jest.fn().mockResolvedValue(() => Promise.resolve()), // Ensure it's mocked as a function returning a promise
//   }));

// describe('Profile Component', () => {
//     test('renders and can log out', async () => {
//         render(
//             <BrowserRouter>
//                 <Profile />
//             </BrowserRouter>
//         );

//         expect(screen.getByText('Profile Page')).toBeInTheDocument();
//         expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();

//         // Simulate logout
//         fireEvent.click(screen.getByText('Logout'));

//         // Here, you would typically check for something that changes in your app upon logout,
//         // such as a call to navigate('/login'). However, since useNavigate is mocked,
//         // you could instead verify the signOut function has been called.
//         expect(auth.signOut).toHaveBeenCalled();
//     });
// });

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "../Profile"; // Adjust the import path according to your project structure
import { BrowserRouter } from "react-router-dom";
import * as firebaseAuth from "../../services/firebase-config"; // assuming auth is exported from here

// Mocking Firebase auth module with signOut as a jest function
jest.mock("../../services/firebase-config", () => ({
  auth: {
    currentUser: {
      email: "test@example.com",
    },
    signOut: jest.fn(() => Promise.resolve()), // signOut is now a mocked function
  },
}));

// Mocking useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Profile Component", () => {
  test("renders and can log out", async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText("Profile Page")).toBeInTheDocument();
    expect(screen.getByText("Email: test@example.com")).toBeInTheDocument();

    // Simulate logout
    fireEvent.click(screen.getByText("Logout"));

    // Now, verify the signOut function has been called.
    expect(firebaseAuth.auth.signOut).toHaveBeenCalled();
  });
});
