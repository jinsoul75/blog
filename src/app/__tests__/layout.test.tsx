import { render } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// ThemeProvider가 제대로 작동하는지 테스트
describe("ThemeProvider Integration", () => {
  it("ThemeProvider가 children을 렌더링한다", () => {
    const { getByText } = render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div>Test Content</div>
      </ThemeProvider>
    );
    
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("기본 테마가 light로 설정된다", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div>Test</div>
      </ThemeProvider>
    );
    
    // document.documentElement에 light 클래스가 있는지 확인
    // (next-themes가 적용되면)
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});
