import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("renders editora home content", () => {
    const { container } = render(<App />);
    expect(container.textContent).toContain("Cortex3");
  });

  it("navigates to root by default", () => {
    render(<App />);
    expect(window.location.pathname).toBe("/");
  });
});
