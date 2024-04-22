import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpinnerPage from '../pages/SpinnerPage';

import GamePage from '../pages/GamePage';
import { useParams } from 'react-router-dom'; 
import io from 'socket.io-client';


//This is Just An Example Test that shows the header is rendered
describe('SpinnerPage Component', () => {
  test('renders the h1 header with the correct text', () => {
    render(<SpinnerPage />);
    const headingElement = screen.getByText('Spinner Page Goes Here');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('Spinner Page Goes Here');
  });
});

// Mocking useParams and setImeddiate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
useParams.mockReturnValue({ gameSession: '5000' });  // Setting default return value for all tests
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));


describe('GamePage Component - Initial State', () => {
  test('initializes state correctly', () => {
    render(<GamePage />);
    // Using queries from @testing-library/react to assert initial state through UI
    expect(screen.queryByText('Test Question')).toBeNull();  // Questions should initially not be visible
    expect(screen.getByText('No data')).toBeInTheDocument(); // Assume "No data" is shown when no questions are loaded
  });
});

describe('GamePage Component - Socket and API Interaction', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ gameSession: '123' });
  });

  test('fetches questions on component mount', async () => {
    const { socket } = require('socket.io-client'); // Ensuring the mock is imported to verify interactions
    render(<GamePage />);
    expect(socket.emit).toHaveBeenCalledWith("join_room", expect.anything());  // Check socket room join
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('the-trivia-api.com'));  // Check if API is called
  });

  test('handles socket "update_player_list" event correctly', () => {
    const { socket } = require('socket.io-client');
    render(<GamePage />);
    socket.on.mock.calls.find(call => call[0] === 'update_player_list')[1](['Charlie', 'Delta']);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Delta')).toBeInTheDocument();
  });
});
  
describe('GamePage Component - User Interactions', () => {
  test('handles answer selection correctly', () => {
    render(<GamePage />);
    const fakeAnswers = [
      { answer: 'Answer 1', isCorrect: false, selectedBy: [] },
      { answer: 'Answer 2', isCorrect: true, selectedBy: [] }
    ];
    // Simulate setting answers
    act(() => {
      setShuffledAnswers(fakeAnswers);
    });
    const answerButton = screen.getByText('Answer 2');
    fireEvent.click(answerButton);
    expect(screen.getByText('Answer 2').parentNode).toHaveClass('selected-choice');
    expect(setSelectedAnswer).toHaveBeenCalledWith({ index: 1, isCorrect: true });
  });
});

jest.useFakeTimers();

describe('GamePage Component - Timers and Scoring', () => {
  test('timer decreases as expected and triggers reveal', () => {
    render(<GamePage />);
    act(() => {
      jest.advanceTimersByTime(1000); // Advance time by 1 second
    });
    expect(setTimer).toHaveBeenCalledWith(expect.any(Number)); // Expect the timer to have been decreased
  });

  test('score updates when an answer is revealed', () => {
    render(<GamePage />);
    // Simulating answer reveal
    act(() => {
      setAnswerRevealed(true);
      setSelectedAnswer({ index: 0, isCorrect: true });
    });
    expect(setScores).toHaveBeenCalledWith(expect.any(Object)); // Check if scores are updated
  });
});

jest.useRealTimers();

describe('GamePage Component - Cleanup', () => {
  test('cleans up on unmount', () => {
    const { unmount } = render(<GamePage />);
    unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1); // Assuming one interval set
    expect(socket.off).toHaveBeenCalledTimes(expect.any(Number)); // Ensure listeners are removed
  });
});
