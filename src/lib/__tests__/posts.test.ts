import { matchesPost, type PostSummary } from "../posts";
const post: PostSummary = {
  id: "1",
  slug: "book",
  title: "함수형 코딩",
  text: "추상화 벽과 React 설계",
  tags: ["도서"],
  category: "후기",
  excerpt: "",
  date: "",
  minutes: 1,
};
test("searches full content and requires every word", () => {
  expect(matchesPost(post, "추상화 REACT", "")).toBe(true);
  expect(matchesPost(post, "추상화 없는단어", "")).toBe(false);
});
test("combines tag and content filters", () => {
  expect(matchesPost(post, "설계", "도서")).toBe(true);
  expect(matchesPost(post, "설계", "여행")).toBe(false);
  expect(matchesPost(post, "도서", "")).toBe(true);
});
