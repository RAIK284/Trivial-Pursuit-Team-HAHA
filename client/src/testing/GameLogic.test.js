import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpinnerPage from '../pages/SpinnerPage';
import GamePage from '../pages/GamePage';



//This is Just An Example Test that shows the header is rendered
describe('SpinnerPage Component', () => {
  test('renders the h1 header with the correct text', () => {
    render(<SpinnerPage />);
    const headingElement = screen.getByText('Spinner Page Goes Here');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('Spinner Page Goes Here');
  });
});

test('GamePage renders', () => {
  render(<GamePage />);
  expect(screen.getByTestId('game-page-container-test')).toBeInTheDocument();
});

describe('GamePage Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('GamePage renders', () => {
    render(<GamePage />);
    expect(screen.getByTestId('game-page-container')).toBeInTheDocument();
  });

  test('displays questions and answers', () => {
    // Mock fetched data or ensure the component is set to receive props correctly
    const mockQuestions = [{
      question: 'What is the capital of France?',
      correctAnswer: 'Paris',
      incorrectAnswers: ['London', 'Berlin']
    }];
    render(<GamePage questions={mockQuestions} />);
    expect(screen.getByTestId('question')).toHaveTextContent('What is the capital of France?');
  });

  test('reveals right and wrong answers after timer', () => {
    render(<GamePage />);
    act(() => {
      jest.advanceTimersByTime(30000); 
    });
    expect(screen.getByTestId('answer-0').className).toContain('correct'); // Ensure your component updates classNames based on state
  });

  test('increments score if the right answer is chosen', () => {
    render(<GamePage />);
    fireEvent.click(screen.getByTestId('answer-0')); 
    expect(screen.getByTestId('score-display')).toHaveTextContent('Score: 100');
  });

  test('keeps score at zero if the wrong answer is chosen', () => {
    render(<GamePage />);
    fireEvent.click(screen.getByTestId('answer-1')); 
    expect(screen.getByTestId('score-display'));
  });

  test('timer renders and counts down', () => {
    render(<GamePage />);
    const initialTimerText = screen.getByTestId('timer-display').textContent;
    act(() => {
      jest.advanceTimersByTime(1000); // Simulate timer counting down
    });
    const updatedTimerText = screen.getByTestId('timer-display').textContent;
    expect(updatedTimerText).not.toBe(initialTimerText);
  });
});
