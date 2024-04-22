import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import GamePage from "../pages/GamePage";
import CreateOrJoinPage from "../pages/CreateOrJoinPage";

describe("Game Tests", () => {
  // Game Session Tests
  it("Creates Or Join Session Page Rendered Correctly", () => {
    render(
      <Router>
        <CreateOrJoinPage />
      </Router>
    );

    expect(screen.getByTestId("create-page")).toBeInTheDocument();
  });

  it("Creates a Game Session Correctly Through the New Game Button", async () => {
    await (async () => {
      render(
        <Router>
          <CreateOrJoinPage />
        </Router>
      );

      fireEvent.click(screen.getByTestId("new-game-button"));

      await waitFor(() => {
        expect(screen.getByTestId("session-id")).toBeInTheDocument();
      });
    });
  });

  it("Joins Game Session Correctly Through the Join Game Button", async () => {
    await (async () => {
      render(
        <Router>
          <CreateOrJoinPage />
        </Router>
      );

      fireEvent.click(screen.getByTestId("new-game-button"));

      let gameSession = "12345";
      await waitFor(() => {
        gameSession = screen.getByTestId("gameSession");
      });

      render(
        <Router>
          <CreateOrJoinPage />
        </Router>
      );
      fireEvent.click(screen.getByTestId("join-game-button"));

      const input = screen.getByPlaceholderText("Game Session ID Here...");
      fireEvent.change(input, { target: { value: { gameSession } } });

      await waitFor(() => {
        expect(screen.getByTestId("session-id")).toBeInTheDocument();
      });
    });
  });

  // Game Page Tests
  it("Renders the Game Page Correctly", () => {
    render(
      <Router>
        <GamePage />
      </Router>
    );

    const backgroundImage = screen.getByAltText("background");
    expect(backgroundImage).toBeInTheDocument();
    expect(screen.getByTestId("game-page")).toBeInTheDocument();
  });

  it("Renders Questions", async () => {
    await (async () => {
      render(
        <Router>
          <GamePage />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId("question")).toBeInTheDocument();
      });
    });
  });

  it("Updates score to 100 on correct answer", async () => {
    await (async () => {
      render(
        <Router>
          <GamePage />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId("question")).toBeInTheDocument();
      });
      let correctAnswer = "";
      await waitFor(() => {
        // First Answer is always correct but shuffled later
        correctAnswer = screen.getAllByTestId("question-choices")[0];
      });
      fireEvent.click(correctAnswer);
      await waitFor(async () => {
        const scoreDisplay = await screen.findByTestId("score");
        expect(scoreDisplay).toHaveTextContent("Score: 100");
      });
    });
  });


  it("Keeps score at 0 on incorrect answer", async () => {
    await (async () => {
      render(
        <Router>
          <GamePage />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId("question")).toBeInTheDocument();
      });
      let correctAnswer = "";
      await waitFor(() => {

        // Any answer that isn't in the first position is incorrect
        correctAnswer = screen.getAllByTestId("question-choices")[1];
      });
      fireEvent.click(correctAnswer);
      await waitFor(async () => {
        const scoreDisplay = await screen.findByTestId("score");
        expect(scoreDisplay).toHaveTextContent("Score: 0");
      });
    });
  });
});
