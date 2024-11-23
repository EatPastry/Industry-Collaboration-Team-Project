import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login.tests'; // Import your Login component

test('logs in successfully with valid credentials (Test Case 1)', () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
  
    fireEvent.change(usernameInput, { target: { value: 'user1' } });
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.click(loginButton);
  
    // Expect redirection (mocked for testing purposes)
    expect(window.location.pathname).toBe('/user1');
  });
  