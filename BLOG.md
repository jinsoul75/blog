# Blog

Next.js App Router + Notion 기반 개인 블로그.

## 실행

`npm run dev` 후 http://localhost:3000 에서 확인합니다.
`npm run build`, `npm run lint`, `npm test -- --runInBand`로 검증합니다.

## Notion

`.env.local`에 NOTION_TOKEN, NOTION_DATABASE_ID가 필요합니다.
Integration에 데이터베이스 읽기 권한을 연결합니다.

- Status: status 속성. Done인 글만 목록, 검색, 상세 페이지에 공개됩니다.
- title 또는 Name: 제목. 기존 제목 기반 URL을 유지합니다.
- Publication Date 또는 Date: 발행일.
- Category: select.
- Tags 또는 Tag: multi_select 또는 select.

## 검색과 업데이트

공개된 모든 글을 페이지네이션 조회한 뒤 본문을 Markdown으로 변환해 검색용 텍스트를 생성합니다.
검색은 제목·본문·태그를 포함하며 공백으로 구분한 모든 단어를 만족하는 글을 찾습니다.
태그 필터와 함께 사용할 수 있고 q/tag URL 파라미터로 공유할 수 있습니다.
홈/검색 인덱스는 1시간, 상세 글은 30분 ISR 재검증 주기를 사용합니다.
개발 모드에서는 요청 시 데이터를 가져옵니다.

현재 검색 인덱스는 브라우저에서 필터링하므로 글의 수와 본문 크기가 매우 커지면 서버 검색으로 전환하는 것이 좋습니다.
제목을 바꾸면 기존 방식대로 URL도 바뀝니다.
