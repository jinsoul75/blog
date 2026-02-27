import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "../ThemeToggle";

// next-themes의 ThemeProvider를 래핑하는 헬퍼
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {ui}
    </ThemeProvider>
  );
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    // document.documentElement 클래스 초기화
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add("light");
  });

  it("초기 렌더링 시 로딩 상태를 보여준다", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("마운트 후 다크모드 버튼을 보여준다", async () => {
    renderWithTheme(<ThemeToggle />);
    
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  it("라이트 모드일 때 '다크 모드' 버튼 텍스트를 보여준다", async () => {
    renderWithTheme(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("다크 모드");
    });
  });

  it("버튼 클릭 시 테마가 토글된다", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    
    // 초기 상태: 라이트 모드
    expect(button).toHaveTextContent("다크 모드");
    
    // 버튼 클릭
    await user.click(button);
    
    // 다크 모드로 변경됨
    await waitFor(() => {
      expect(button).toHaveTextContent("라이트 모드");
      expect(document.documentElement).toHaveClass("dark");
    });
    
    // 다시 클릭
    await user.click(button);
    
    // 라이트 모드로 변경됨
    await waitFor(() => {
      expect(button).toHaveTextContent("다크 모드");
      expect(document.documentElement).toHaveClass("light");
    });
  });

  it("테마 변경 시 localStorage에 저장된다", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    await user.click(button);
    
    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  it("버튼이 올바른 스타일 클래스를 가진다", async () => {
    renderWithTheme(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "fixed",
        "top-4",
        "right-4",
        "cursor-pointer",
        "rounded-full"
      );
    });
  });
});
