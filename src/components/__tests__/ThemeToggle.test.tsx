import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "../ThemeToggle";
describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "light";
  });
  it("accessible toggle switches both theme and saved preference", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "다크 모드로 전환" }));
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(localStorage.getItem("theme")).toBe("dark");
    await user.click(
      screen.getByRole("button", { name: "라이트 모드로 전환" }),
    );
    await waitFor(() => expect(document.documentElement).toHaveClass("light"));
  });
});
