import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpinnerPage from '../pages/SpinnerPage';


//This is Just An Example Test that shows the header is rendered
describe('SpinnerPage Component', () => {
  test('renders the h1 header with the correct text', () => {
    render(<SpinnerPage />);
    const headingElement = screen.getByText('Spinner Page Goes Here');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('Spinner Page Goes Here');
  });
});
