# One Touch Fitting 제품 DB 관리 시스템 개발 로드맵

원터치 피팅 제품 데이터를 Supabase DB에 적재하고 두 가지 뷰(Research / My 제품)로 조회·검색할 수 있는 내부 관리 도구 MVP를 구축합니다.

---

## 프로젝트 개요

**One Touch Fitting 제품 DB 관리 시스템**은 내부 운영팀을 위한 제품 데이터 조회·검색 도구로, 다음 기능을 제공합니다.

- **Research 제품 관리**: 리서치 단계의 제품 데이터를 필터·검색·페이지네이션으로 조회
- **My 제품 관리**: 확정된 자사 제품 데이터를 조회하고 상세 정보를 모달로 확인
- **인증 기반 접근 제어**: 로그인한 내부 사용자만 제품 페이지에 접근 가능

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript, React 19 |
| 스타일링 | Tailwind CSS v4, shadcn/ui (new-york), Lucide React |
| 백엔드 | Supabase (PostgreSQL, Auth, RLS) |
| 배포 | Vercel |

---

## 전체 진행률

| Phase | 작업 수 | 완료 | 진행률 |
|-------|---------|------|--------|
| Phase 1: DB 세팅 | 5 | 5 | 100% |
| Phase 2: Research 제품 페이지 | 4 | 4 | 100% |
| Phase 3: My 제품 페이지 | 5 | 4 | 80% |
| **전체** | **14** | **13** | **93%** |

---

## 개발 워크플로우

### 1. 작업 계획

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

### 2. 작업 생성

- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-db-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함
- `/tasks` 디렉토리의 마지막 완료된 작업을 예시로 참조

### 3. 작업 구현

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- 각 단계 완료 후 작업 파일 내 진행 상황 업데이트
- 각 단계 완료 후 중단하고 추가 지시를 기다림

### 4. 로드맵 업데이트

- 로드맵에서 완료된 작업을 상태 아이콘으로 표시

---

## 상태 아이콘 범례

- `⬜` 미완료 (대기 중)
- `🔄` 진행 중
- `✅` 완료

---

## 개발 단계

### ✅ Phase 1: DB 세팅

> 예상 소요 시간: 0.5일
> 목표: Supabase에 `research_products`, `my_products` 테이블을 생성하고 실제 데이터를 적재한다.

---

#### ✅ Task 001: Supabase 테이블 생성 및 RLS 정책 설정

- 관련 파일: `lib/supabase/database.types.ts`, Supabase SQL Editor
- 예상 소요 시간: 2시간

**구현 사항**

- `research_products` 테이블 DDL 작성 및 실행
  - 컬럼 구성: 제품 ID, 제품명, 브랜드, 카테고리, 가격, 원산지, 소재, 이미지 URL, 상세 설명 등 엑셀 원본 컬럼 기준으로 정의
- `my_products` 테이블 DDL 작성 및 실행
  - 컬럼 구성: 제품 ID, 제품명, 브랜드, 카테고리, 판매가, 원가, 마진율, 상세 설명(HTML), 이미지 URL, 등록일 등
- 두 테이블에 Row Level Security(RLS) 활성화
- 인증된 사용자(authenticated role)만 SELECT 가능한 RLS 정책 생성
- Supabase 대시보드에서 RLS 정책 동작 확인

**수락 기준**

- SQL Editor에서 두 테이블이 정상 생성됨
- 비인증 요청 시 데이터 조회 불가 확인
- 인증 요청 시 데이터 조회 가능 확인

---

#### ✅ Task 002: 엑셀 데이터 CSV 변환 및 Supabase 적재

- 관련 파일: `researchproduct.xlsx`, `myproduct.xlsx`, Supabase 대시보드 또는 Node.js 스크립트
- 예상 소요 시간: 2시간

**구현 사항**

- `researchproduct.xlsx` → CSV 변환 후 컬럼명을 DB 스키마에 맞게 정리
- `myproduct.xlsx` → CSV 변환 후 컬럼명을 DB 스키마에 맞게 정리
- 방법 A (권장): Supabase 대시보드 Table Editor에서 CSV 직접 임포트
- 방법 B (대안): Node.js 스크립트(`scripts/import-data.ts`)를 작성하여 `@supabase/supabase-js`로 일괄 upsert
- 데이터 적재 후 건수 및 샘플 데이터 정합성 확인

**수락 기준**

- `research_products` 테이블에 엑셀 원본 데이터 전량 적재 완료
- `my_products` 테이블에 엑셀 원본 데이터 전량 적재 완료
- null 값, 인코딩 오류, 숫자 포맷 오류 없음 확인

---

#### ✅ Task 003: TypeScript 타입 재생성

- 관련 파일: `lib/supabase/database.types.ts`
- 예상 소요 시간: 30분

**구현 사항**

- Supabase MCP 도구(`generate_typescript_types`)를 사용하여 `database.types.ts` 재생성
- `research_products`, `my_products` 테이블의 Row/Insert/Update 타입이 포함되었는지 확인
- 기존 `profiles` 테이블 타입이 유지되었는지 확인
- 재생성된 타입 파일을 프로젝트에 반영

**수락 기준**

- `database.types.ts`에 `ResearchProduct`, `MyProduct` 관련 타입이 자동 생성됨
- `npm run type-check` 오류 없음

---

#### ✅ Task 004: 공통 제품 타입 및 유틸리티 정의

- 관련 파일: `lib/supabase/database.types.ts`, `lib/products/types.ts` (신규), `lib/products/utils.ts` (신규)
- 예상 소요 시간: 1시간

**구현 사항**

- `lib/products/types.ts` 신규 생성
  - `ResearchProduct` 타입 (database.types.ts 기반 재export 또는 확장)
  - `MyProduct` 타입
  - 공통 필터 파라미터 타입 `ProductFilterParams` 정의
  - 페이지네이션 파라미터 타입 `PaginationParams` 정의
- `lib/products/utils.ts` 신규 생성
  - 가격 포맷 함수 `formatPrice(value: number): string` 구현 (원화 표기)
  - 날짜 포맷 함수 `formatDate(value: string): string` 구현

**수락 기준**

- 타입 파일 임포트 시 `npm run type-check` 오류 없음
- 유틸리티 함수 단위 동작 확인

---

#### ✅ Task 005: 미들웨어 인증 보호 범위 확인

- 관련 파일: `lib/supabase/proxy.ts`
- 예상 소요 시간: 30분

**구현 사항**

- `proxy.ts`의 `updateSession` 함수에서 `/products/*` 경로가 인증 보호 대상에 포함되는지 확인
- 현재 로직: `/`, `/auth/*`, `/login` 이외의 모든 비인증 요청 → `/auth/login` 리다이렉트
- 별도 조치 없이 기존 미들웨어로 `/products/*` 보호가 자동 적용됨을 문서화
- 필요 시 명시적 경로 추가

**수락 기준**

- 비로그인 상태에서 `/products/research` 접근 시 `/auth/login`으로 리다이렉트 확인
- 로그인 상태에서 `/products/research` 정상 접근 확인

---

### ✅ Phase 2: Research 제품 페이지 구현

> 예상 소요 시간: 1.5일
> 목표: `/products/research` 페이지에서 research_products 데이터를 필터·검색·페이지네이션으로 조회한다.

---

#### ✅ Task 006: Research 제품 데이터 조회 함수 구현

- 관련 파일: `lib/supabase/server.ts`, `lib/products/types.ts`
- 예상 소요 시간: 2시간

**구현 사항**

- `lib/supabase/server.ts`에 `getResearchProducts` 함수 추가
  - 파라미터: `filters: ProductFilterParams`, `pagination: PaginationParams`, `search?: string`
  - Supabase 서버 클라이언트(`createClient`)를 통한 `research_products` 조회
  - 검색: `ilike` 연산자로 제품명/브랜드 부분 일치 검색
  - 필터: 카테고리, 브랜드 등 distinct 컬럼 기준 필터링
  - 페이지네이션: `.range(from, to)` 적용
  - 반환값: `{ data: ResearchProduct[], count: number }`
- `getResearchProductFilterOptions` 함수 추가
  - 카테고리, 브랜드 등 필터용 distinct 값 목록 조회
  - 반환값: `{ categories: string[], brands: string[] }` 형태

**수락 기준**

- `npm run type-check` 오류 없음
- 함수 호출 시 올바른 데이터 반환 확인 (개발 서버 로그 검증)

---

#### ✅ Task 007: Research 제품 공통 UI 컴포넌트 구현

- 관련 파일: `components/products/ProductFilter.tsx` (신규), `components/products/ProductSearch.tsx` (신규), `components/products/Pagination.tsx` (신규)
- 예상 소요 시간: 3시간

**구현 사항**

- shadcn/ui 컴포넌트 추가 설치: `npx shadcn add select dialog`
- `components/products/ProductFilter.tsx` 구현
  - shadcn `Select` 컴포넌트 기반
  - props: `label`, `options: string[]`, `value`, `onChange`
  - URL 쿼리 파라미터(`useSearchParams`, `useRouter`)와 연동
- `components/products/ProductSearch.tsx` 구현
  - shadcn `Input` + `Button` (검색 아이콘) 조합
  - 검색어 입력 후 Enter 또는 버튼 클릭 시 URL 쿼리 파라미터 업데이트
  - 검색어 초기화 버튼 포함
- `components/products/Pagination.tsx` 구현
  - 이전/다음 페이지 버튼, 현재 페이지 및 전체 페이지 수 표시
  - URL 쿼리 파라미터(`page`) 기반 동작
  - shadcn `Button` 사용

**수락 기준**

- 각 컴포넌트가 독립적으로 렌더링 오류 없이 동작
- URL 쿼리 파라미터 변경이 정상적으로 반영됨

---

#### ✅ Task 008: Research 제품 테이블 컴포넌트 및 페이지 구현

- 관련 파일: `components/products/ResearchProductTable.tsx` (신규), `app/products/research/page.tsx` (신규), `app/layout.tsx` 또는 공통 네비게이션 컴포넌트
- 예상 소요 시간: 3시간

**구현 사항**

- `components/products/ResearchProductTable.tsx` 구현
  - props: `data: ResearchProduct[]`
  - shadcn `Table` 컴포넌트 기반 (`npx shadcn add table`)
  - 컬럼 구성: 제품명, 브랜드, 카테고리, 가격, 원산지 등 주요 필드
  - 데이터 없을 때 빈 상태(empty state) UI 표시
- `app/products/research/page.tsx` Server Component 구현
  - `searchParams`에서 필터, 검색어, 페이지 번호 추출
  - `getResearchProducts`, `getResearchProductFilterOptions` 호출
  - `ProductFilter`, `ProductSearch`, `ResearchProductTable`, `Pagination` 조합
  - `Suspense`를 활용한 로딩 상태 처리
- 공통 네비게이션에 "Research 제품" 링크 추가
  - 현재 `app/page.tsx`의 nav 요소 또는 별도 레이아웃 컴포넌트에 링크 삽입

**수락 기준**

- `/products/research` 접근 시 테이블에 실제 데이터 정상 표시
- 검색어 입력 시 필터링된 결과 표시
- 필터 선택 시 해당 카테고리/브랜드만 표시
- 페이지 이동 정상 동작
- 개발 서버(`npm run dev`)에서 전체 플로우 검증 완료

---

#### ✅ Task 009: Research 제품 페이지 통합 검증

- 관련 파일: `app/products/research/page.tsx`, `lib/supabase/server.ts`
- 예상 소요 시간: 1시간

**구현 사항**

- 개발 서버에서 다음 시나리오 직접 검증
  - 전체 목록 조회 (필터 없음)
  - 검색어 입력 후 결과 확인
  - 필터 옵션 선택 후 결과 확인
  - 필터 + 검색어 복합 조건 확인
  - 페이지 이동 (1 → 2 → 이전)
  - 검색 결과 없을 때 빈 상태 UI 확인
- `npm run build` 빌드 오류 없음 확인
- `npm run lint` 린트 오류 없음 확인

**수락 기준**

- 위 모든 시나리오 정상 동작
- 빌드 및 린트 오류 없음

---

### 🔄 Phase 3: My 제품 페이지 구현

> 예상 소요 시간: 1.5일
> 목표: `/products/my` 페이지에서 my_products 데이터를 조회하고 행 클릭 시 상세 정보 모달을 표시한다.

---

#### ✅ Task 010: My 제품 데이터 조회 함수 구현

- 관련 파일: `lib/supabase/server.ts`, `lib/products/types.ts`
- 예상 소요 시간: 1시간

**구현 사항**

- `lib/supabase/server.ts`에 `getMyProducts` 함수 추가
  - 파라미터: `filters: ProductFilterParams`, `pagination: PaginationParams`, `search?: string`
  - `research_products`와 동일한 패턴으로 `my_products` 조회
  - 가격 관련 컬럼(판매가, 원가, 마진율) 포함
  - 상세 설명(HTML) 컬럼 포함
- `getMyProductFilterOptions` 함수 추가
  - 카테고리, 브랜드 등 필터용 distinct 값 목록 조회

**수락 기준**

- `npm run type-check` 오류 없음
- 함수 호출 시 올바른 데이터 반환 확인 (개발 서버 로그 검증)

---

#### ✅ Task 011: My 제품 테이블 및 상세 모달 컴포넌트 구현

- 관련 파일: `components/products/MyProductTable.tsx` (신규), `components/products/MyProductDetailModal.tsx` (신규)
- 예상 소요 시간: 3시간

**구현 사항**

- `@tailwindcss/typography` 설치 및 설정
  - `npm install @tailwindcss/typography`
  - `tailwind.config.ts`의 `plugins`에 추가
- `components/products/MyProductTable.tsx` 구현
  - props: `data: MyProduct[]`
  - shadcn `Table` 기반
  - 컬럼 구성: 제품명, 브랜드, 카테고리, 판매가(`formatPrice` 적용), 원가, 마진율, 등록일
  - **행 클릭 이벤트**: 클릭한 행의 제품 데이터를 상태로 저장 후 모달 오픈
  - 행에 `cursor-pointer` 및 hover 스타일 적용
  - `"use client"` 선언 (클릭 이벤트 처리)
- `components/products/MyProductDetailModal.tsx` 구현
  - props: `product: MyProduct | null`, `open: boolean`, `onClose: () => void`
  - shadcn `Dialog` 컴포넌트 기반
  - 상세 정보 섹션: 제품명, 브랜드, 가격 정보(판매가/원가/마진율), 기본 속성
  - 상세 설명 섹션: `dangerouslySetInnerHTML`로 HTML 렌더링, `prose` 클래스 적용
  - 이미지 URL이 있을 경우 `next/image`로 썸네일 표시

**수락 기준**

- 테이블 행 클릭 시 해당 제품 상세 모달 정상 표시
- HTML 상세 설명이 올바르게 렌더링됨
- 모달 닫기(X 버튼, 외부 클릭) 정상 동작

---

#### ✅ Task 012: My 제품 페이지 구현 및 네비게이션 연결

- 관련 파일: `app/products/my/page.tsx` (신규), 공통 네비게이션 컴포넌트
- 예상 소요 시간: 2시간

**구현 사항**

- `app/products/my/page.tsx` Server Component 구현
  - `searchParams`에서 필터, 검색어, 페이지 번호 추출
  - `getMyProducts`, `getMyProductFilterOptions` 호출
  - Phase 2에서 구현한 공통 컴포넌트 재사용: `ProductFilter`, `ProductSearch`, `Pagination`
  - `MyProductTable` 사용 (클라이언트 컴포넌트)
  - `Suspense`를 활용한 로딩 상태 처리
- 공통 네비게이션에 "My 제품" 링크 추가
  - "Research 제품" 링크와 함께 네비게이션 바에 배치
  - 현재 활성 페이지에 active 스타일 적용

**수락 기준**

- `/products/my` 접근 시 테이블에 실제 데이터 정상 표시
- 행 클릭 시 상세 모달 정상 동작
- 검색, 필터, 페이지네이션 정상 동작
- 네비게이션에서 Research/My 제품 페이지 이동 정상 동작

---

#### 🔄 Task 013: 최종 통합 검증 및 Vercel 배포

- 관련 파일: 전체 프로젝트, Vercel 대시보드
- 예상 소요 시간: 1시간

**구현 사항**

- 개발 서버에서 전체 사용자 플로우 최종 검증
  - 비로그인 → `/products/research` 접근 → `/auth/login` 리다이렉트
  - 로그인 → Research 제품 페이지 → 검색/필터/페이지네이션
  - 로그인 → My 제품 페이지 → 행 클릭 → 상세 모달 → 닫기
  - 네비게이션에서 두 페이지 간 이동
- `npm run build` 프로덕션 빌드 오류 없음 확인
- `npm run lint` 린트 오류 없음 확인
- Vercel에 프로덕션 배포
  - Vercel 프로젝트에 환경 변수 설정 확인 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
  - 배포 후 운영 환경에서 동일 플로우 검증
  - Supabase RLS가 운영 환경에서 정상 동작하는지 확인

**수락 기준**

- 모든 사용자 플로우 정상 동작
- 빌드 및 린트 오류 없음
- Vercel 배포 성공 및 운영 URL에서 정상 접근 확인

---

#### ✅ Task 014: 피팅 가이드 페이지 구현

- 관련 파일: `app/products/guide/page.tsx` (신규), `app/products/guide/_content.tsx` (신규), `app/products/guide/_image.tsx` (신규), `components/products/ProductNav.tsx`, `next.config.ts`
- 소요 시간: 반나절

**구현 사항**

- `/products/guide` 라우트 신규 생성 (정적 Server Component)
- `ProductNav`에 "피팅 가이드" 탭 추가
- 5개 섹션으로 구성된 초보자용 가이드 콘텐츠:
  - 원터치 피팅 개요 (정의 + 3대 특징 카드)
  - 주요 형태별 종류 (PC/PL/PT·PST/PY/PUC — 상아뉴매틱 기준 모델명 + 제품 사진)
  - 규격 및 사이즈 선택법 (호스 외경 mm/인치, 나사산 규격 표, 모델명 읽기 예시)
  - 온라인 마켓 인기 구성 (네이버스토어·쿠팡 트렌드 기반 TOP 5)
  - 초보자 선택 4단계 (외경 → 포트 규격 → 형태 → 재질)
- 상아뉴매틱 공식 이미지 사용을 위해 `next.config.ts`에 `www.sanga2000.com` 도메인 추가
- 이미지 로드 실패 시 placeholder 처리용 `ShapeImage` 클라이언트 컴포넌트 추가

**수락 기준**

- `/products/guide` 접근 시 5개 섹션 정상 표시
- 형태별 카드에 제품 사진 표시 (에러 시 placeholder 표시)
- `npm run build` 오류 없음

---

## MVP 제외 항목 (향후 개발 예정)

아래 기능들은 MVP 범위에 포함되지 않으며, 향후 별도 Phase에서 개발 예정입니다.

| 기능 | 설명 |
|------|------|
| 어드민 데이터 업로드 UI | 엑셀/CSV 파일을 UI에서 직접 업로드하여 DB 적재 |
| 제품 데이터 수정/삭제 | 테이블 내 인라인 편집 또는 편집 모달을 통한 CRUD |
| 엑셀 내보내기 | 현재 조회 결과를 `.xlsx` 또는 `.csv`로 다운로드 |
| ~~모바일 반응형~~ | ~~태블릿/모바일 뷰포트에 최적화된 반응형 레이아웃~~ → **완료** |
| Research-My 제품 비교 기능 | Research 제품과 My 제품을 나란히 비교하는 뷰 |
| 이미지 실제 표시 | 이미지 URL을 파싱하여 썸네일 목록 형태로 표시 |
| 대시보드/통계 | 카테고리별 제품 수, 가격 분포 등 통계 차트 화면 |

---

## 관련 파일 구조 (구현 완료 후 예상)

```
app/
  products/
    research/
      page.tsx          # Research 제품 목록 페이지 (Server Component)
    my/
      page.tsx          # My 제품 목록 페이지 (Server Component)

components/
  products/
    ProductFilter.tsx       # 공통 필터 컴포넌트 (Select)
    ProductSearch.tsx       # 공통 검색 컴포넌트 (Input + Button)
    Pagination.tsx          # 공통 페이지네이션 컴포넌트
    ResearchProductTable.tsx # Research 제품 테이블
    MyProductTable.tsx      # My 제품 테이블 (행 클릭 이벤트)
    MyProductDetailModal.tsx # My 제품 상세 모달 (Dialog + HTML 렌더링)

lib/
  products/
    types.ts            # 제품 관련 TypeScript 타입 정의
    utils.ts            # 가격/날짜 포맷 유틸리티 함수
  supabase/
    server.ts           # getResearchProducts, getMyProducts 등 조회 함수 추가
    database.types.ts   # 자동 생성 타입 (research_products, my_products 포함)
```
