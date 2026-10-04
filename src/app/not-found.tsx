import Link from "next/link";
export default function NotFound() {
  return <main id="main-content" className="home-shell empty-state"><h1>글을 찾을 수 없어요</h1><p>주소가 변경되었거나 공개되지 않은 글입니다.</p><Link href="/">전체 글 보기 ↗</Link></main>;
}
