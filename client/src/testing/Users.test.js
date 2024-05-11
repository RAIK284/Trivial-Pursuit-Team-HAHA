import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "../pages/RegisterPage";
import fetchMock from "jest-fetch-mock";
import LoginPage from "../pages/LoginPage";

describe("UserTests", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  // Register Tests
  it("Renders the Register Page Correctly", () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
    const backgroundImage = screen.getByAltText("background");
    expect(backgroundImage).toBeInTheDocument();
    expect(screen.getByTestId("register-page")).toBeInTheDocument();
  });

  it("Renders the Register Form Correctly", () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
    const registerForm = screen.getByTestId("register-form");
    expect(registerForm).toBeInTheDocument();
  });

  it("Register Form Input Values State Initialized Correctly", () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    expect(usernameInput.value).toBe("");
    expect(passwordInput.value).toBe("");
    expect(confirmPasswordInput.value).toBe("");
  });

  it("Register Form Shows Error if Password Do Not Match", () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByTestId("register-button");

    fireEvent.change(passwordInput, { target: { value: "password1" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password2" } });

    fireEvent.click(registerButton);

    const error = screen.getByTestId("password-error");
    expect(error).toBeInTheDocument();
  });

  fetchMock.enableMocks();
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("Displays Error If Username is Already Used", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: null }), {
      status: 200,
    });

    await (async () => {
      render(
        <Router>
          <RegisterPage />
        </Router>
      );

      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      const confirmPasswordInput =
        screen.getByPlaceholderText("Confirm Password");
      const registerButton = screen.getByTestId("register-button");

      // Create User
      fireEvent.change(usernameInput, { target: { value: "username" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
      fireEvent.click(registerButton);

      // Try to Create that Same User a Second Time
      fireEvent.change(usernameInput, { target: { value: "username" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByTestId("username-error")).toBeInTheDocument();
      });
    });
  });

  it("Submits the Register Form successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: null }), {
      status: 200,
    });

    await (async () => {
      render(
        <Router>
          <RegisterPage />
        </Router>
      );

      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      const confirmPasswordInput =
        screen.getByPlaceholderText("Confirm Password");
      const registerButton = screen.getByTestId("register-button");

      fireEvent.change(usernameInput, { target: { value: "username" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByTestId("success-toast")).toBeInTheDocument();
      });
    });
  });

  // Login Tests
  it("Renders the Login Page Correctly", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const backgroundImage = screen.getByAltText("background");
    expect(backgroundImage).toBeInTheDocument();
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("Renders the Login Form Correctly", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toBeInTheDocument();
  });

  it("should register a new user, login, and navigate to the 'create-page'", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: null }), {
      status: 200,
    });

    await (async () => {
      render(
        <Router>
          <RegisterPage />
        </Router>
      );

      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      const confirmPasswordInput =
        screen.getByPlaceholderText("Confirm Password");
      const registerButton = screen.getByTestId("register-button");

      fireEvent.change(usernameInput, { target: { value: "username" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByTestId("success-toast")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("success-toast"));

      // Mock login response
      fetchMock.mockResponseOnce(JSON.stringify({ token: "mock" }), {
        status: 200,
      });

      const loginUsernameInput = screen.getByPlaceholderText("Username");
      const loginPasswordInput = screen.getByPlaceholderText("Password");
      const loginButton = screen.getByTestId("login-button");

      fireEvent.change(loginUsernameInput, {
        target: { value: "username" },
      });
      fireEvent.change(loginPasswordInput, {
        target: { value: "password" },
      });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId("create-page")).toBeInTheDocument();
      });
    });
  });
});
