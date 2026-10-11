type TimelineEntry = {
  period: string;
  title: string;
  organization: string;
  description: string;
};

type Project = {
  name: string;
  category: string;
  description: string;
  highlights: string[];
  stack: string[];
  source?: string;
  href?: string;
};

export const profile = {
  name: "김진솔 · Jinsoul Kim",
  role: "Frontend Developer",
  headline: "복잡한 데이터를\n사용하기 쉬운 화면으로.",
  introduction:
    "안녕하세요, 프론트엔드 개발자 김진솔입니다. React와 JavaScript를 중심으로 약 2년간 데이터 시각화, 지도 기반 공간분석, 백오피스와 사용자용 웹 인터페이스를 개발했습니다. 요구사항을 화면과 데이터 흐름으로 구체화하고, 렌더링 성능과 재사용 가능한 UI 구조를 함께 고민합니다.",
  github: "https://github.com/jinsoul75",
  email: "wlsthf75@gmail.com",
  skills: [
    { label: "Frontend", items: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Next.js", "Tailwind CSS"] },
    { label: "State & Data", items: ["REST API", "TanStack Query", "TanStack Table", "Zustand", "Redux Toolkit", "MongoDB", "SQLite"] },
    { label: "Visualization", items: ["D3.js", "Canvas", "Cesium.js", "amCharts 4"] },
    { label: "Delivery", items: ["Git", "GitHub Actions", "Vercel", "CI/CD", "JSDoc", "AI-assisted development"] },
  ],
  projects: [
    {
      name: "대용량 반도체 데이터 시각화",
      category: "TDI / 2025.08 – 2025.12",
      description: "수만 개 데이터 포인트를 SVG로 그리던 분석 화면에서 화면 멈춤과 Out of Memory 오류가 발생했습니다. 기존 amCharts 4 차트를 분석하고 D3.js와 Canvas로 렌더링 구조를 재설계했습니다.",
      highlights: [
        "D3.js로 scale·axis를 계산하고 데이터 포인트는 단일 Canvas에 그리도록 분리",
        "Canvas 좌표계에 맞춰 hover, tooltip, 범례, 필터와 리사이즈 동작 재구현",
        "분석 입력 폼 2개와 유효성 검사 구현",
        "화면 멈춤과 메모리 오류를 해소하고 대량 데이터 표시 및 고객 검수 완료",
      ],
      stack: ["React", "JavaScript", "D3.js", "Canvas", "amCharts 4"],
    },
    {
      name: "공간분석 Micro App & 백오피스",
      category: "ZETALUX SYSTEM / 2024.03 – 2025.06",
      description: "도시침수 대응과 디지털트윈 플랫폼에서 현장 데이터 관리, 공간분석 실행, 지도 결과 확인을 위한 웹 인터페이스를 개발했습니다.",
      highlights: [
        "약 5개월간 LX 플랫폼에 연동되는 공간분석 Micro App 10종 개발",
        "Getis-Ord Gi*와 Moran’s I 등을 논문·수학 공식에 기반해 구현하고 ArcGIS 결과와 비교 검증",
        "입력 폼부터 REST API 처리, Cesium.js 3D 시각화, qiankun 연동까지 구현 후 납품·검수 완료",
        "현장점검 CRUD, 이미지 업로드와 알림톡 즉시·예약 발송 및 이력 관리 화면 구현",
        "TanStack Query·Table과 Zustand로 상태를 분리하고 Compound Component와 JSDoc으로 중복 UI 및 인터페이스 정리",
      ],
      stack: ["React", "TypeScript", "Cesium.js", "qiankun", "TanStack Query", "TanStack Table", "Zustand"],
    },
    {
      name: "안경 추천 웹 프로토타입",
      category: "1001 OPTOMETRY / 2026.07 – 현재",
      description: "호주 안경원 고객을 위한 얼굴형 분석 및 상품 추천 프로토타입을 개발하고, Shopify 상품 데이터 운영을 함께 담당하고 있습니다.",
      highlights: [
        "Next.js와 TypeScript로 촬영 가이드, 얼굴형 분석 결과와 상품 추천 화면 구현",
        "주간 CEO 피드백을 반영해 질문 단계와 결과 화면의 사용자 흐름 개선",
        "판매 저조 상품의 업로드 시트를 정리하고 Matrixify로 Shopify Admin에 일괄 반영",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shopify Admin", "Matrixify"],
    },
    {
      name: "Next.js 커뮤니티 게시판",
      category: "PERSONAL PROJECT",
      description: "서버 렌더링과 인증, 데이터 저장부터 사용자 인터랙션까지 구현한 커뮤니티 게시판입니다.",
      highlights: ["Next.js 13 App Router 기반 게시글 목록 SSR 및 게시글 CRUD 구현", "NextAuth·Kakao OAuth 인증과 MongoDB Atlas 기반 댓글·좋아요 REST API 구현"],
      stack: ["Next.js 13", "React", "TypeScript", "NextAuth", "MongoDB Atlas", "REST API"],
    },
    {
      name: "쇼핑 북마크",
      category: "PERSONAL PROJECT",
      description: "상품을 탐색하고 관심 상품을 저장하는 쇼핑 북마크 인터페이스입니다.",
      highlights: ["카테고리 필터, 북마크, Modal·Toast, 이미지 fallback 및 오류 처리 UI 구현", "Redux Toolkit 상태 관리와 Intersection Observer 기반 무한 스크롤 구현"],
      stack: ["React", "TypeScript", "Redux Toolkit", "REST API", "CSS"],
    },
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
  ] satisfies Project[],
  experience: [
    { period: "2026.07 – 현재", title: "Frontend Developer Intern", organization: "1001 Optometry · Sydney", description: "얼굴형 분석·안경 추천 웹 프로토타입 개발과 이해관계자 피드백 반영, Shopify 상품 데이터 운영을 담당하고 있습니다." },
    { period: "2025.08 – 2025.12", title: "Frontend Developer", organization: "TDI · 이천", description: "대용량 반도체 데이터 차트의 SVG 렌더링을 D3.js·Canvas로 전환하고 상호작용 기능과 분석 입력 폼을 구현했습니다." },
    { period: "2024.03 – 2025.06", title: "Frontend Developer", organization: "Zetalux System · 성남", description: "React 기반 도시침수 대응·디지털트윈 플랫폼에서 지도 시각화, 공간분석, 데이터 관리와 백오피스 화면을 개발했습니다." },
  ] satisfies TimelineEntry[],
  education: [
    { period: "재학 중 · 2028.08 졸업 예정", title: "컴퓨터과학과", organization: "한국방송통신대학교", description: "컴퓨터과학 학사 과정" },
    { period: "2023", title: "Software Engineering Frontend", organization: "Code States", description: "프론트엔드 과정 수료" },
    { period: "2018", title: "식품영양학과 학사", organization: "경상국립대학교", description: "학사 졸업" },
  ] satisfies TimelineEntry[],
};
