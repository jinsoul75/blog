type TimelineEntry = {
  period: string;
  title: string;
  organization: string;
  description: string;
};

// Add verified career and education entries here before sharing as a resume.
export const profile = {
  name: "Jinsoul",
  headline: "배우고, 만들고,\n기록하는 일.",
  introduction:
    "개발하며 배운 것과 일상에서 발견한 생각을 기록합니다. 이곳에 직접 만든 프로젝트와 앞으로의 경험을 하나씩 모아갑니다.",
  github: "https://github.com/jinsoul75",
  email: "",
  projects: [
    {
      name: "Jinsoul blog",
      category: "PERSONAL PROJECT",
      description:
        "Notion에 작성한 글을 웹에서 읽을 수 있는 개인 블로그. 글을 쓰는 과정과 읽는 경험을 함께 다듬어가는 프로젝트입니다.",
      highlights: [
        "Notion 콘텐츠를 Markdown으로 변환해 글 상세 페이지에 표시",
        "검색과 태그 필터로 원하는 글 탐색",
        "제목 기반 URL, 본문 목차와 라이트·다크 모드 지원",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Notion API"],
      source: "https://github.com/jinsoul75/blog",
      href: "/",
    },
  ],
  experience: [] as TimelineEntry[],
  education: [] as TimelineEntry[],
};
