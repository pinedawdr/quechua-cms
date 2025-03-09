import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null); // Simulate no user logged in
    return jest.fn(); // Return unsubscribe function
  }),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

test('renders login page when not authenticated', () => {
  render(<App />);
  const loginElement = screen.getByText(/Iniciar Sesión/i);
  expect(loginElement).toBeInTheDocument();
});