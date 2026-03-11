내부 직원용 CRM이라면 B2C랑 우선순위가 꽤 달라지죠. 핵심적인 부분들 짚어드릴게요.
기술 스택 선택
프레임워크: Vite + React (CRA는 이제 deprecated)
상태관리: 복잡한 Redux보다 Zustand 또는 React Query(TanStack Query) 조합 추천

서버 상태(API 데이터) → TanStack Query
클라이언트 UI 상태 → Zustand 또는 그냥 useState/Context

UI 라이브러리: 내부 툴이니 디자인에 공수 덜 쓰고 shadcn/ui 또는 Ant Design 추천

shadcn/ui: 커스터마이징 자유도 높음, Tailwind 기반
Ant Design: 테이블, 폼, 필터 등 CRM에 필요한 컴포넌트가 풍부함 (내부툴엔 이게 더 빠를 수도)

라우팅: React Router v6

폴더 구조
내부 CRM은 기능(도메인) 중심으로 나누는 게 유지보수하기 훨씬 편합니다.
src/
├── features/          # 도메인별 기능 단위
│   ├── customers/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── types.ts
│   ├── orders/
│   └── ...
├── components/        # 공통 컴포넌트 (Button, Table, Modal 등)
├── layouts/           # 사이드바, 헤더 등 레이아웃
├── lib/               # axios 인스턴스, 유틸 함수 등
├── hooks/             # 공통 훅
└── pages/             # 라우트 단위 페이지 (얇게 유지)

CRM이라 특히 신경 쓸 것들
인증/권한

JWT + refresh token 패턴
역할(Role)에 따른 메뉴/버튼 노출 제어가 필수
React Router의 Protected Route 패턴으로 처리

테이블/목록 화면

CRM의 80%는 목록 + 상세 + 폼임
페이지네이션, 정렬, 필터를 URL 쿼리스트링으로 동기화해두면 나중에 링크 공유나 뒤로가기 처리가 편함
TanStack Table 고려해볼 만함

API 레이어

axios 인스턴스를 하나 만들어서 인터셉터로 토큰 주입, 에러 핸들링 중앙화
TanStack Query로 캐싱 + 로딩/에러 상태 처리


B2C 대비 덜 신경 써도 되는 것

SEO, meta 태그 → 무관
번들 사이즈 최적화 → 어느 정도만 (내부 직원이 쓰는 거라 초기 로딩 허용 범위 넓음)
디자인 퀄리티 → UI 라이브러리 기본 테마로도 충분


초기 세팅 순서 추천

npm create vite@latest 로 프로젝트 생성
Tailwind + shadcn/ui 또는 Ant Design 설치
React Router 세팅 + 레이아웃(사이드바/헤더) 구조 잡기
axios 인스턴스 + TanStack Query 세팅
인증 플로우(로그인 → 토큰 저장 → Protected Route) 구현
이후 도메인별 feature 개발

팀 규모나 백엔드 스택이 어떻게 되는지, 특별히 고민되는 부분이 있으면 더 구체적으로 얘기해드릴 수 있어요.