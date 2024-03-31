import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwitchBar from './switchBar'; // Adjust the import path as necessary

describe('SwitchBar Component', () => {
  it('should render without errors', () => {
    render(<SwitchBar />);
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('calls onLogin when the Log in button is clicked', () => {
    const onLogin = jest.fn();
    const onSignUp = jest.fn();

    render(<SwitchBar onLogin={onLogin} onSignUp={onSignUp} />);

    fireEvent.click(screen.getByText('Log in'));
    expect(onLogin).toHaveBeenCalled();
    expect(onSignUp).not.toHaveBeenCalled();
  });

  it('calls onSignUp when the Sign up button is clicked', () => {
    const onLogin = jest.fn();
    const onSignUp = jest.fn();

    render(<SwitchBar onLogin={onLogin} onSignUp={onSignUp} />);

    fireEvent.click(screen.getByText('Sign up'));
    expect(onSignUp).toHaveBeenCalled();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('should toggle active class on buttons when clicked', () => {
    // Create mock functions
    const onLoginMock = jest.fn();
    const onSignUpMock = jest.fn();

    const { getByText } = render(<SwitchBar onLogin={onLoginMock} onSignUp={onSignUpMock} />);

    // Get buttons
    const loginButton = getByText('Log in');
    const signUpButton = getByText('Sign up');

    // Click the "Log in" button
    fireEvent.click(loginButton);

    // Expect the onLoginMock to be called
    expect(onLoginMock).toHaveBeenCalled();

    // Click the "Sign up" button
    fireEvent.click(signUpButton);

    // Expect the onSignUpMock to be called
    expect(onSignUpMock).toHaveBeenCalled();
    
    // Expect the active class to be toggled
    expect(loginButton).not.toHaveClass('active');
    expect(signUpButton).toHaveClass('active');
  });
});