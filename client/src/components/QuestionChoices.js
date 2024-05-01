import React from 'react';

const QuestionChoices = ({ choices, handleClick, answerRevealed, selectedAnswer }) => {
  return choices.map((choice, index) => (
    <div
      className={`question-choices question-choice-${index + 1} ${
        answerRevealed
          ? choice.isCorrect
            ? "question-true"
            : "question-false"
          : ""
      } ${selectedAnswer?.index === index ? "selected-choice" : ""}`}
      onClick={() => handleClick(choice, index)}
      key={index}
    >
      {choice.answer}
    </div>
  ));
};

export default QuestionChoices;
