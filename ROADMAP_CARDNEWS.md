# SUPERFIX CardNews Factory 개발 로드맵

SUPERFIX 에어피팅 및 공압부품 상품 데이터를 기반으로 인스타그램 카드뉴스를 자동 생성하는 내부 운영 시스템을 구축합니다.

---

## 프로젝트 개요

**SUPERFIX CardNews Factory**는 내부 운영팀을 위한 카드뉴스 자동 생성 도구로, 다음 기능을 제공합니다.

- **상품 DB 연동**: `my_products` 테이블과 연동하여 상품 목록 및 이미지 현황을 조회
- **템플릿 기반 카드뉴스 생성**: TYPE A(문제 해결형) / TYPE B(규격 설명형) / TYPE C(제품 소개형) 3종 템플릿
- **PNG 자동 생성 및 다운로드**: Playwright HTML→PNG 렌더링 후 ZIP 파일로 일괄 다운로드
- **AI 문구 보조 (선택)**: Claude Sonnet API를 활용한 슬라이드 문구 개선 기능

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript, React 19 |
| 스타일링 | Tailwind CSS v4, shadcn/ui (new-york), Lucide React |
| 백엔드 | Supabase (PostgreSQL, Auth, Storage, RLS) |
| PNG 렌더링 | Playwright (HTML→PNG) |
| 배포 | Vercel |
| AI 문구 (선택) | Claude Sonnet API (Anthropic) |

---

## 전체 진행률

| Phase | 작업 수 | 완료 | 진행률 |
|-------|---------|------|--------|
| Phase 1: 상품 DB 및 이미지 현황 | 4 | 4 | 100% |
| Phase 2: 카드뉴스 템플릿 및 PNG 생성 | 6 | 6 | 100% |
| Phase 3: AI 문구 개선 (선택 기능) | 3 | 0 | 0% |
| Phase 4: 인스타그램 최적화 개선 | 4 | 4 | 100% |
| **전체** | **17** | **14** | **82%** |

---

## 성공 기준

> PC04-M5 선택 → TYPE C 템플릿 → 문구 자동 생성 → 미리보기 → PNG 생성 → ZIP 다운로드 — **1분 이내** 완료

---

## 개발 워크플로우

### 1. 작업 계획

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP_CARDNEWS.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

### 2. 작업 생성

- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `101-cardnews-route.md`)
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

### Phase 1: 상품 DB 및 이미지 현황

> 예상 소요 시간: 1일
> 목표: `/cardnews` 라우트 그룹을 생성하고 `my_products` 데이터를 기반으로 상품 목록 및 이미지 현황 페이지를 구축한다.

---

#### ✅ Task 101: /cardnews 라우트 그룹 및 레이아웃 생성

- 관련 파일: `app/cardnews/layout.tsx` (신규), `app/cardnews/dashboard/page.tsx` (신규), `app/cardnews/products/page.tsx` (신규), `app/cardnews/images/page.tsx` (신규), `app/cardnews/generate/page.tsx` (신규), `app/cardnews/download/page.tsx` (신규), `app/cardnews/settings/page.tsx` (신규)
- 예상 소요 시간: 2시간

**구현 사항**

- `app/cardnews/` 라우트 그룹 디렉토리 생성
- `app/cardnews/layout.tsx` 구현
  - CardNews 전용 사이드바 네비게이션 레이아웃 구성
  - 네비게이션 항목: 대시보드, 상품 관리, 이미지 현황, 카드뉴스 생성, 다운로드, 브랜드 설정
  - 현재 활성 페이지에 active 스타일 적용
  - 기존 상단 네비게이션과 조화를 이루는 레이아웃 구성
- 각 페이지의 빈 껍데기 파일 생성 (라우팅 확인용)
  - `app/cardnews/dashboard/page.tsx`
  - `app/cardnews/products/page.tsx`
  - `app/cardnews/images/page.tsx`
  - `app/cardnews/generate/page.tsx`
  - `app/cardnews/download/page.tsx`
  - `app/cardnews/settings/page.tsx`
- 기존 상단 네비게이션에 "CardNews" 링크 추가

**수락 기준**

- `/cardnews/dashboard` 접근 시 레이아웃 정상 렌더링
- 사이드바 네비게이션에서 각 페이지로 이동 가능
- 기존 네비게이션에서 CardNews 섹션으로 진입 가능

---

#### ✅ Task 102: 상품 관리 페이지 구현 (/cardnews/products)

- 관련 파일: `app/cardnews/products/page.tsx`, `components/cardnews/CardNewsProductTable.tsx` (신규), `lib/cardnews/types.ts` (신규)
- 예상 소요 시간: 3시간

**구현 사항**

- `lib/cardnews/types.ts` 신규 생성
  - `CardNewsProduct` 타입 (`my_products` 기반, `image_path` 포함)
  - `CardNewsJob` 타입 (카드뉴스 생성 작업 이력)
  - `CardNewsTemplate` 타입 (템플릿 타입 A/B/C)
  - `SlideData` 타입 (슬라이드 문구 데이터)
  - `CopyRule` 타입 (제품 타입별 문구 규칙)
- `lib/supabase/server.ts`에 `getCardNewsProducts` 함수 추가
  - `my_products` 테이블에서 카드뉴스 생성에 필요한 컬럼만 선택 조회
  - 검색(제품명), 카테고리 필터, 페이지네이션 지원
  - `image_path` 유무 여부를 기준으로 이미지 보유 상태 포함
- `components/cardnews/CardNewsProductTable.tsx` 구현
  - 컬럼 구성: 제품명, 카테고리, `image_path` 이미지 미리보기 (썸네일), 카드뉴스 생성 버튼
  - `image_path` 있을 경우 `<img>` 태그로 썸네일 표시, 없을 경우 "이미지 없음" 배지 표시
  - 행 선택(체크박스) 기능으로 복수 제품 선택 가능
  - 선택된 제품으로 카드뉴스 생성 페이지 이동 버튼
- `app/cardnews/products/page.tsx` Server Component 구현
  - 검색, 필터, 페이지네이션 포함
  - 상단에 총 상품 수 및 이미지 보유 비율 요약 배지 표시

**수락 기준**

- `/cardnews/products` 접근 시 `my_products` 실제 데이터 정상 표시
- 이미지 있는 상품에 썸네일 정상 표시
- 검색 및 필터 정상 동작
- 제품 선택 후 생성 페이지 이동 동작

---

#### ✅ Task 103: 이미지 현황 페이지 구현 (/cardnews/images)

- 관련 파일: `app/cardnews/images/page.tsx`, `components/cardnews/ImageGrid.tsx` (신규), `components/cardnews/ImageStatusTabs.tsx` (신규)
- 예상 소요 시간: 2시간

**구현 사항**

- `lib/supabase/server.ts`에 `getProductImageStatus` 함수 추가
  - `my_products` 테이블에서 `image_path` 컬럼 전체 조회
  - 이미지 보유 상품(`image_path IS NOT NULL`)과 누락 상품(`image_path IS NULL`) 분리 집계
- `components/cardnews/ImageStatusTabs.tsx` 구현
  - shadcn `Tabs` 컴포넌트 기반
  - 탭 구성: "전체", "이미지 있음", "이미지 누락"
  - 각 탭에 카운트 배지 표시
- `components/cardnews/ImageGrid.tsx` 구현
  - `image_path` URL 기반 이미지 그리드 뷰 (3열 또는 4열)
  - 각 카드: 이미지 썸네일 + 제품명 + `image_path` URL 표시
  - 이미지 로드 실패 시 placeholder 처리 (에러 핸들링)
  - 이미지 누락 탭에서는 제품명 + "이미지 없음" 안내 카드 표시
- `app/cardnews/images/page.tsx` Server Component 구현
  - 상단에 이미지 보유율 요약 통계 카드 표시
  - `ImageStatusTabs`와 `ImageGrid` 조합

**수락 기준**

- `/cardnews/images` 접근 시 이미지 그리드 정상 표시
- 탭 전환 시 필터링된 결과 정상 표시
- 이미지 누락 탭에서 누락 상품 목록 확인 가능

---

#### ✅ Task 104: 대시보드 페이지 구현 (/cardnews/dashboard)

- 관련 파일: `app/cardnews/dashboard/page.tsx`, `components/cardnews/StatCard.tsx` (신규)
- 예상 소요 시간: 1.5시간

**구현 사항**

- `lib/supabase/server.ts`에 `getCardNewsDashboardStats` 함수 추가
  - 총 상품 수, 이미지 보유 상품 수, 이미지 누락 상품 수 집계
  - 생성된 카드뉴스 총 수 (Phase 2 이후 `card_news_jobs` 테이블 연동 예정, 현재는 0으로 표시)
  - 최근 생성 작업 목록 (최대 5건)
- `components/cardnews/StatCard.tsx` 구현
  - props: `title`, `value`, `description`, `icon`, `variant`
  - shadcn `Card` 컴포넌트 기반
- `app/cardnews/dashboard/page.tsx` Server Component 구현
  - 통계 카드 4개: 총 상품 수, 이미지 보유 수, 카드뉴스 생성 수, 이미지 보유율
  - 최근 생성 작업 목록 테이블 (Phase 2 이후 실제 데이터 연동)
  - 빠른 이동 버튼: "카드뉴스 생성 시작" → `/cardnews/generate`

**수락 기준**

- `/cardnews/dashboard` 접근 시 통계 카드 정상 표시
- 실제 `my_products` 집계 데이터 반영 확인
- "카드뉴스 생성 시작" 버튼 클릭 시 `/cardnews/generate`로 이동

---

### Phase 2: 카드뉴스 템플릿 및 PNG 생성

> 예상 소요 시간: 3일
> 목표: Supabase에 카드뉴스 관련 테이블을 생성하고, 5단계 스텝퍼 UI와 TYPE A/B/C 슬라이드 컴포넌트를 구현한 뒤 Playwright로 PNG를 생성하여 다운로드까지 제공한다.

---

#### ✅ Task 201: Supabase 카드뉴스 테이블 생성

- 관련 파일: Supabase SQL Editor, `lib/supabase/database.types.ts`
- 예상 소요 시간: 2시간

**구현 사항**

- `card_news_templates` 테이블 DDL 작성 및 실행
  - 컬럼: `id`, `type` (A/B/C), `name`, `slide_count`, `slide_structure` (JSONB), `created_at`
  - 초기 데이터 시드: TYPE A(문제 해결형, 5슬라이드), TYPE B(규격 설명형, 5슬라이드), TYPE C(제품 소개형, 5슬라이드)
- `copy_rules` 테이블 DDL 작성 및 실행
  - 컬럼: `id`, `template_type` (A/B/C), `product_category`, `slide_index`, `copy_pattern` (TEXT), `placeholder_keys` (JSONB), `created_at`
  - 제품 카테고리별 슬라이드 문구 규칙 초기 데이터 시드
- `card_news_jobs` 테이블 DDL 작성 및 실행
  - 컬럼: `id`, `product_id` (my_products 참조), `template_type`, `slide_copies` (JSONB), `status` (pending/processing/done/failed), `output_urls` (JSONB, PNG URL 배열), `created_by` (auth.users 참조), `created_at`, `updated_at`
- 세 테이블에 RLS 활성화 및 인증된 사용자 SELECT/INSERT 정책 설정
- Supabase MCP 도구(`generate_typescript_types`)로 `database.types.ts` 재생성
- `lib/cardnews/types.ts`에 신규 테이블 타입 반영

**수락 기준**

- 세 테이블 정상 생성 및 초기 데이터 시드 완료
- RLS 정책 적용 후 인증/비인증 동작 확인
- `database.types.ts`에 신규 테이블 타입 포함 확인
- `npm run type-check` 오류 없음

---

#### ✅ Task 202: 카드뉴스 생성 5단계 스텝퍼 UI 구현 (/cardnews/generate)

- 관련 파일: `app/cardnews/generate/page.tsx`, `components/cardnews/GenerateStepper.tsx` (신규), `components/cardnews/steps/Step1Product.tsx` (신규), `components/cardnews/steps/Step2Template.tsx` (신규), `components/cardnews/steps/Step3Copy.tsx` (신규), `components/cardnews/steps/Step4Preview.tsx` (신규), `components/cardnews/steps/Step5Export.tsx` (신규)
- 예상 소요 시간: 4시간

**구현 사항**

- `components/cardnews/GenerateStepper.tsx` 구현
  - props: `currentStep`, `totalSteps`, `steps: { label, description }[]`
  - 상단 스텝 인디케이터 UI (번호 + 레이블)
  - 현재 스텝 하이라이트, 완료 스텝 체크 아이콘 표시
  - 이전/다음 버튼 (스텝 간 이동)
  - `"use client"` 선언 (상태 관리)
- Step 1 — 상품 선택 (`Step1Product.tsx`)
  - `my_products` 목록 테이블 표시 (이미지 썸네일 포함)
  - 검색 및 카테고리 필터 지원
  - 단일 상품 선택 (라디오 버튼 또는 행 클릭)
  - 선택된 상품 정보 사이드 패널 표시
- Step 2 — 템플릿 선택 (`Step2Template.tsx`)
  - TYPE A/B/C 카드 선택 UI
  - 각 템플릿 타입의 설명 및 슬라이드 구성 미리보기
  - 선택된 템플릿 하이라이트 표시
- Step 3 — 문구 편집 (`Step3Copy.tsx`)
  - `copy_rules` 기반 자동 문구 생성 (제품 데이터 + 규칙 조합)
  - 슬라이드별 문구 편집 폼 (shadcn `Textarea`)
  - 슬라이드 인덱스 탭으로 슬라이드 간 전환
  - Phase 3에서 AI 개선 버튼 추가 예정 (현재는 placeholder)
- Step 4 — 미리보기 (`Step4Preview.tsx`)
  - 선택한 템플릿 + 문구가 적용된 슬라이드 미리보기
  - 슬라이드 간 이동 (이전/다음 버튼)
  - 썸네일 스트립으로 전체 슬라이드 한눈에 확인
- Step 5 — 내보내기 (`Step5Export.tsx`)
  - PNG 생성 시작 버튼
  - 생성 진행 상태 표시 (로딩 스피너 + 진행률)
  - 생성 완료 후 ZIP 다운로드 버튼
  - `card_news_jobs` 테이블에 작업 이력 저장
- `app/cardnews/generate/page.tsx` 클라이언트 컴포넌트 구현
  - 스텝 상태(현재 스텝, 선택된 상품/템플릿/문구 데이터) 관리
  - `GenerateStepper` + 각 Step 컴포넌트 조합

**수락 기준**

- `/cardnews/generate` 접근 시 스텝퍼 UI 정상 렌더링
- 각 스텝 간 이전/다음 이동 정상 동작
- Step 1에서 상품 선택 → Step 2에서 템플릿 선택 데이터 전달 확인
- Step 3에서 자동 생성된 문구 편집 가능 확인
- Step 4에서 미리보기 슬라이드 정상 렌더링

---

#### ✅ Task 203: 카드뉴스 슬라이드 HTML 컴포넌트 구현 (TYPE A/B/C)

- 관련 파일: `components/cardnews/slides/SlideTypeA.tsx` (신규), `components/cardnews/slides/SlideTypeB.tsx` (신규), `components/cardnews/slides/SlideTypeC.tsx` (신규), `components/cardnews/slides/SlideWrapper.tsx` (신규)
- 예상 소요 시간: 4시간

**구현 사항**

- `components/cardnews/slides/SlideWrapper.tsx` 구현
  - 공통 슬라이드 컨테이너 (1080×1080px 기준)
  - 브랜드 로고, 배경색, 공통 하단 영역 포함
  - props: `slideIndex`, `totalSlides`, `brandColor`, `logoUrl`
- `components/cardnews/slides/SlideTypeA.tsx` — 문제 해결형 (5슬라이드)
  - Slide 1: 타이틀 슬라이드 — 문제 제시 헤드라인 + 제품 이미지
  - Slide 2: 문제점 강조 — 아이콘 + 설명 텍스트 3가지
  - Slide 3: 해결책 제시 — 제품 스펙 하이라이트 카드
  - Slide 4: 제품 상세 — `image_path` 이미지 + 주요 특징 리스트
  - Slide 5: CTA — 구매 유도 문구 + 브랜드 정보
- `components/cardnews/slides/SlideTypeB.tsx` — 규격 설명형 (5슬라이드)
  - Slide 1: 타이틀 슬라이드 — 규격 안내 헤드라인 + 제품 이미지
  - Slide 2: 규격 테이블 — 호스 외경/나사 규격 정보
  - Slide 3: 모델명 읽기 — 제품 코드 분해 설명 인포그래픽
  - Slide 4: 선택 가이드 — 상황별 추천 규격
  - Slide 5: CTA — 구매 유도 문구 + 브랜드 정보
- `components/cardnews/slides/SlideTypeC.tsx` — 제품 소개형 (5슬라이드)
  - Slide 1: 타이틀 슬라이드 — 제품명 + `image_path` 이미지
  - Slide 2: 제품 특징 — 3가지 핵심 특징 아이콘 카드
  - Slide 3: 스펙 상세 — 주요 사양 테이블
  - Slide 4: 활용 사례 — 사용 환경/적용 분야 이미지
  - Slide 5: CTA — 구매 유도 문구 + 브랜드 정보
- 각 슬라이드 컴포넌트는 인라인 스타일 또는 Tailwind 클래스로 구성
  - Playwright HTML→PNG 렌더링 시 외부 폰트/CSS 의존성 최소화
  - 1080×1080px 고정 크기 레이아웃
  - `image_path` 외부 URL 이미지 정상 렌더링 확인

**수락 기준**

- TYPE A/B/C 각 슬라이드 컴포넌트가 브라우저에서 정상 렌더링
- 1080×1080px 레이아웃 비율 유지 확인
- 제품 이미지(`image_path`) 정상 표시 확인
- 미리보기 Step 4에서 슬라이드 정상 표시

---

#### ✅ Task 204: PNG 렌더링 API Route 구현 (Playwright)

- 관련 파일: `app/api/cardnews/render/route.ts` (신규), `lib/cardnews/playwright.ts` (신규)
- 예상 소요 시간: 4시간

**구현 사항**

- `lib/cardnews/playwright.ts` 신규 생성
  - `renderSlidesToPng(slides: SlideRenderPayload[]): Promise<Buffer[]>` 함수 구현
  - Playwright `chromium.launch()` → 페이지 생성 → HTML 콘텐츠 주입 → `screenshot({ type: 'png' })`
  - 뷰포트 크기: 1080×1080px 고정
  - 각 슬라이드 HTML 문자열을 순차적으로 렌더링하여 PNG Buffer 반환
  - 렌더링 완료 후 브라우저 종료 (리소스 누수 방지)
- `app/api/cardnews/render/route.ts` POST Route Handler 구현
  - 요청 바디: `{ jobId: string, slides: SlideRenderPayload[] }`
  - 인증 확인 (서버 Supabase 클라이언트로 세션 검증)
  - `renderSlidesToPng` 호출하여 PNG Buffer 배열 생성
  - 생성된 PNG를 Supabase Storage `card-news` 버킷에 업로드
    - 경로 형식: `{userId}/{jobId}/slide-{index}.png`
  - `card_news_jobs` 테이블의 `output_urls`, `status` 업데이트
  - 응답: `{ success: true, urls: string[] }`
- Supabase Storage `card-news` 버킷 생성 및 정책 설정
  - 인증된 사용자의 본인 폴더 내 파일 업로드/조회 허용
- `package.json`에 `playwright` 의존성 추가 확인
  - `npx playwright install chromium` 실행 안내

**테스트 체크리스트**

- [x] POST `/api/cardnews/render` 호출 시 PNG Buffer 정상 생성
- [x] Supabase Storage에 파일 업로드 성공 확인
- [x] 비인증 요청 시 인증 처리 확인 (미들웨어 /auth/login 리다이렉트)
- [x] `card_news_jobs` 테이블 status 업데이트 확인
- [ ] 렌더링 실패 시 에러 응답 및 status `failed` 업데이트 확인

**수락 기준**

- `/api/cardnews/render` 엔드포인트 정상 응답
- Supabase Storage에 PNG 파일 저장 확인
- 생성된 PNG 파일 브라우저에서 직접 접근 가능

---

#### ✅ Task 205: ZIP 다운로드 API Route 및 다운로드 페이지 구현

- 관련 파일: `app/api/cardnews/download/route.ts` (신규), `app/cardnews/download/page.tsx`, `components/cardnews/DownloadJobCard.tsx` (신규)
- 예상 소요 시간: 3시간

**구현 사항**

- `app/api/cardnews/download/route.ts` GET Route Handler 구현
  - 쿼리 파라미터: `jobId`
  - 인증 확인
  - `card_news_jobs` 테이블에서 `output_urls` 조회
  - Supabase Storage에서 PNG 파일들을 Buffer로 다운로드
  - `jszip` 라이브러리로 ZIP 파일 생성
    - 파일명 형식: `{제품명}_{templateType}_slide{n}.png`
  - ZIP Buffer를 `application/zip` Content-Type으로 응답
  - `Content-Disposition: attachment; filename="{jobId}.zip"` 헤더 설정
- `package.json`에 `jszip` 의존성 추가 (`npm install jszip @types/jszip`)
- `components/cardnews/DownloadJobCard.tsx` 구현
  - props: `job: CardNewsJob`
  - 카드 구성: 제품명, 템플릿 타입, 생성 일시, 상태 배지, 슬라이드 썸네일 스트립, ZIP 다운로드 버튼
  - 다운로드 버튼 클릭 시 `/api/cardnews/download?jobId={id}` 호출 후 파일 저장
- `app/cardnews/download/page.tsx` Server Component 구현
  - `card_news_jobs` 테이블에서 현재 사용자의 작업 이력 조회 (최신순)
  - `DownloadJobCard` 목록 렌더링
  - 빈 상태(empty state) UI: "생성된 카드뉴스가 없습니다. 카드뉴스 생성 시작하기" 링크

**테스트 체크리스트**

- [x] GET `/api/cardnews/download?jobId={id}` 호출 시 ZIP 파일 다운로드 성공
- [x] 다운로드된 ZIP 내 PNG 파일 수 및 파일명 확인 (`원터치 에어피팅 PC 타입 4mm M5_C.zip`)
- [x] 비인증 요청 시 인증 처리 확인 (미들웨어 /auth/login 리다이렉트)
- [ ] 본인이 아닌 다른 사용자의 jobId 접근 시 403 응답 확인

**수락 기준**

- `/cardnews/download` 페이지에서 작업 이력 목록 정상 표시
- ZIP 다운로드 버튼 클릭 시 파일 다운로드 성공
- 다운로드된 ZIP 파일 압축 해제 후 PNG 파일 정상 확인

---

#### ✅ Task 206: 브랜드 설정 페이지 및 전체 통합 검증

- 관련 파일: `app/cardnews/settings/page.tsx`, `lib/cardnews/brand.ts` (신규)
- 예상 소요 시간: 2.5시간

**구현 사항**

- `lib/cardnews/brand.ts` 신규 생성
  - `BrandSettings` 타입 정의: `primaryColor`, `secondaryColor`, `logoUrl`, `companyName`, `tagline`
  - 기본값 설정 (SUPERFIX 브랜드 색상 기준)
  - `localStorage` 또는 Supabase DB 기반 설정 저장/불러오기 함수
- `app/cardnews/settings/page.tsx` 클라이언트 컴포넌트 구현
  - 브랜드 색상 설정 (Primary / Secondary 색상 컬러 피커)
  - 로고 URL 입력 필드
  - 회사명 및 슬로건 입력 필드
  - 설정 저장 버튼
  - 슬라이드 미리보기 패널 (실시간 반영)
- 전체 플로우 통합 검증
  - 상품 선택 → 템플릿 선택 → 문구 편집 → 미리보기 → PNG 생성 → ZIP 다운로드 전체 플로우
  - 1분 이내 완료 목표 시간 검증 (PC04-M5 + TYPE C 기준)
  - `npm run build` 빌드 오류 없음 확인
  - `npm run lint` 린트 오류 없음 확인

**테스트 체크리스트**

- [x] PC04-M5 상품 선택 → TYPE C 템플릿 → 문구 자동 생성 → 미리보기 → PNG 생성 → ZIP 다운로드 전체 플로우 완료
- [x] 브랜드 설정 저장 후 슬라이드 미리보기에 반영 확인
- [x] `npm run build` 오류 없음
- [x] `npm run lint` 오류 없음 (0 errors)

**수락 기준**

- 브랜드 설정 저장 및 슬라이드 반영 정상 동작
- 전체 카드뉴스 생성 플로우 1분 이내 완료
- 빌드 및 린트 오류 없음

---

### Phase 4: 인스타그램 최적화 개선

> 완료일: 2026-06-22
> 목표: 실제 인스타그램 운영 수준의 카드뉴스 품질 달성 — 세로형(1080×1350), SUPERFIX 오렌지 브랜드 컬러, 문제 해결형 훅 구조, 제품 타입별 자동 훅 시스템 적용

---

#### ✅ Task 401: 1080×1350 세로형 변경 + SUPERFIX 브랜드 컬러 적용

- 관련 파일: `lib/cardnews/playwright.ts`, `lib/cardnews/brand.ts`, `lib/cardnews/slide-renderer.ts`, `app/api/cardnews/render/route.ts`, `components/cardnews/slides/SlideWrapper.tsx`, `components/cardnews/steps/Step4Preview.tsx`

**변경 사항**
- 캔버스 크기: 1080×1080 → **1080×1350** (인스타 세로형 4:5 비율)
- 기본 브랜드 컬러: #1D4ED8(파랑) → **#FF6A00(오렌지)** / Secondary: #111111
- 미리보기 스케일 컨테이너 width/height 분리 (1350 높이 대응)

---

#### ✅ Task 402: TYPE A 문제 해결형 템플릿 완전 재설계

- 관련 파일: `components/cardnews/slides/SlideTypeA.tsx`, `lib/cardnews/slide-renderer.ts`, `components/cardnews/steps/Step2Template.tsx`

**새 슬라이드 구조**
- Slide 0: **훅(Hook)** — 공감형 질문 + 제품 이미지 (상단 40% 텍스트 / 하단 60% 이미지)
- Slide 1: **문제 공감** — #111111 배경, 문제점 3가지
- Slide 2: **해결 방법** — 규격 카드 (모델명/튜브/나사)
- Slide 3: **제품 소개** — 이미지 60% + 스펙 텍스트 40%
- Slide 4: **CTA** — 클릭 유도형 (`"배관 규격이 고민된다면?\n프로필 링크 확인"`)

---

#### ✅ Task 403: 제품 타입별 훅 자동 생성 시스템

- 관련 파일: `lib/cardnews/hooks.ts` (신규), `components/cardnews/steps/Step3Copy.tsx`

**훅 매핑 (모델 코드 → 기본 훅)**
- PC → `"4mm 호스 연결, 뭘 써야 할까?"`
- PL → `"좁은 공간에서 배관 연결이 어렵다면?"`
- PB → `"배관 방향을 바꿔야 한다면?"`
- PY → `"호스를 분기해야 한다면?"`
- PWT → `"두 방향을 동시에 연결해야 한다면?"`
- PST → `"부식 걱정 없이 T자 배관이 필요하다면?"`
- Step3Copy: copy_rules 없을 때 TYPE A Slide 0에 타입별 훅 자동 적용

---

#### ✅ Task 404: 제품명 축약 + CTA 개선 + 슬라이드 B/C 업데이트

- 관련 파일: `components/cardnews/slides/SlideTypeB.tsx`, `components/cardnews/slides/SlideTypeC.tsx`, `lib/cardnews/slide-renderer.ts`

**변경 사항**
- 제품명 표시: `product_name`(긴 이름) → **`model`(모델코드) + `shape`(형태명)** 2줄 구조
- TYPE B Slide0: 모델명 대형 표시 + 형태명 보조 텍스트 (slide-renderer.ts와 일치)
- TYPE C Slide0: 모델명 우선 표시 (58px 굵은 폰트)
- 모든 TYPE의 CTA(Slide 4): `"배관 규격이 고민된다면?\n프로필 링크 확인"` 통일
- copy_rules 우선순위 버그 수정: null 기본 문구 → category 전용 문구가 덮어쓰도록 보장

---

### Phase 3: AI 문구 개선 (선택 기능)

> 예상 소요 시간: 1일
> 목표: Claude Sonnet API를 활용하여 Step 3 문구 편집 단계에서 AI 기반 슬라이드 문구 개선 기능을 추가한다.

---

#### ⬜ Task 301: Claude Sonnet API 연동 및 문구 개선 프롬프트 설계

- 관련 파일: `lib/cardnews/ai.ts` (신규), `app/api/cardnews/improve-copy/route.ts` (신규)
- 예상 소요 시간: 2시간

**구현 사항**

- `@anthropic-ai/sdk` 패키지 설치 (`npm install @anthropic-ai/sdk`)
- 환경 변수 추가: `ANTHROPIC_API_KEY`
- `lib/cardnews/ai.ts` 신규 생성
  - `improveSlideCopy(input: ImproveCopyInput): Promise<string[]>` 함수 구현
  - `ImproveCopyInput` 타입: `{ productName, category, templateType, slideIndex, currentCopy, productSpecs }`
  - Claude Sonnet API 호출 (인스타그램 카드뉴스 최적화 문구 개선 프롬프트)
  - 프롬프트 구성: 제품 정보 + 템플릿 타입 + 현재 문구 + 개선 지시
  - 반환: 개선된 문구 배열 (슬라이드 수 유지)
- `app/api/cardnews/improve-copy/route.ts` POST Route Handler 구현
  - 요청 바디: `ImproveCopyInput`
  - 인증 확인
  - `improveSlideCopy` 호출
  - 응답: `{ improvedCopy: string[] }`
  - 에러 처리: API 호출 실패 시 원본 문구 반환

**테스트 체크리스트**

- [ ] POST `/api/cardnews/improve-copy` 호출 시 개선된 문구 정상 반환
- [ ] 비인증 요청 시 401 응답 확인
- [ ] Claude API 호출 실패 시 에러 핸들링 확인
- [ ] 반환된 문구 슬라이드 수 일치 확인

**수락 기준**

- `/api/cardnews/improve-copy` 엔드포인트 정상 응답
- 개선된 문구가 인스타그램 카드뉴스에 적합한 톤 확인
- 에러 발생 시 원본 문구 유지 동작 확인

---

#### ⬜ Task 302: Step 3 문구 편집 단계에 AI 개선 버튼 추가

- 관련 파일: `components/cardnews/steps/Step3Copy.tsx`, `components/cardnews/AiImproveButton.tsx` (신규)
- 예상 소요 시간: 2시간

**구현 사항**

- `components/cardnews/AiImproveButton.tsx` 신규 생성
  - props: `onImprove: () => Promise<void>`, `isLoading: boolean`
  - shadcn `Button` 기반, AI 아이콘(Lucide `Sparkles`) 포함
  - 로딩 중 스피너 + "AI가 문구를 개선하는 중..." 텍스트 표시
  - 완료 시 토스트 알림 ("문구가 개선되었습니다")
- `components/cardnews/steps/Step3Copy.tsx` 업데이트
  - 슬라이드 문구 편집 폼 상단에 "AI 문구 개선" 버튼 추가
  - 버튼 클릭 시 `/api/cardnews/improve-copy` 호출
  - 반환된 개선 문구로 폼 값 업데이트
  - 개선 전/후 비교 토글 버튼 추가 (원본 문구 ↔ AI 개선 문구)
  - 개선 문구 적용 취소 버튼 (원본으로 되돌리기)

**수락 기준**

- Step 3에서 "AI 문구 개선" 버튼 정상 표시 및 동작
- AI 개선 문구가 폼에 자동 입력 확인
- 원본 문구로 되돌리기 정상 동작
- 로딩 상태 UI 정상 표시

---

#### ⬜ Task 303: Phase 3 최종 검증 및 배포

- 관련 파일: 전체 프로젝트, Vercel 대시보드
- 예상 소요 시간: 1시간

**구현 사항**

- 개발 서버에서 AI 문구 개선 포함 전체 플로우 검증
  - 상품 선택 → 템플릿 선택 → AI 문구 개선 → 미리보기 → PNG 생성 → ZIP 다운로드
  - AI 문구 개선 버튼 클릭 → 응답 수신 → 폼 업데이트 확인
  - 원본 문구 복원 기능 동작 확인
- `npm run build` 빌드 오류 없음 확인
- `npm run lint` 린트 오류 없음 확인
- Vercel 환경 변수 추가: `ANTHROPIC_API_KEY`
- Vercel 배포 후 운영 환경에서 전체 플로우 검증

**테스트 체크리스트**

- [ ] AI 문구 개선 포함 전체 플로우 1분 30초 이내 완료 확인
- [ ] Vercel 운영 환경에서 AI API 호출 정상 동작 확인
- [ ] `npm run build` 오류 없음
- [ ] `npm run lint` 오류 없음

**수락 기준**

- AI 문구 개선 기능 포함 전체 플로우 정상 동작
- 빌드 및 린트 오류 없음
- Vercel 운영 환경 배포 성공

---

## 향후 고려 사항

| 기능 | 설명 |
|------|------|
| 카드뉴스 템플릿 추가 | TYPE D(비교형), TYPE E(이벤트형) 등 추가 템플릿 확장 |
| 배치 생성 | 여러 상품을 한 번에 선택하여 카드뉴스 일괄 생성 |
| 스케줄 발행 | 생성된 카드뉴스를 인스타그램 API로 예약 발행 |
| 문구 히스토리 | 슬라이드 문구 버전 관리 및 이전 버전 복원 |
| 팀 공유 | 생성된 카드뉴스를 팀원과 공유하는 링크 기능 |

---

## 관련 파일 구조 (구현 완료 후 예상)

```
app/
  cardnews/
    layout.tsx                    # CardNews 전용 사이드바 레이아웃
    dashboard/
      page.tsx                    # 대시보드 (통계 카드)
    products/
      page.tsx                    # 상품 관리 (my_products 연동)
    images/
      page.tsx                    # 이미지 현황 (image_path 그리드)
    generate/
      page.tsx                    # 카드뉴스 생성 (5단계 스텝퍼)
    download/
      page.tsx                    # 생성 결과 다운로드
    settings/
      page.tsx                    # 브랜드 설정
  api/
    cardnews/
      render/
        route.ts                  # Playwright HTML→PNG 렌더링 API
      download/
        route.ts                  # ZIP 다운로드 API
      improve-copy/
        route.ts                  # Claude Sonnet 문구 개선 API

components/
  cardnews/
    GenerateStepper.tsx           # 5단계 스텝퍼 공통 컴포넌트
    CardNewsProductTable.tsx      # 상품 목록 테이블
    ImageGrid.tsx                 # 이미지 그리드 뷰
    ImageStatusTabs.tsx           # 이미지 현황 탭
    StatCard.tsx                  # 통계 카드
    DownloadJobCard.tsx           # 다운로드 작업 카드
    AiImproveButton.tsx           # AI 문구 개선 버튼
    steps/
      Step1Product.tsx            # Step 1: 상품 선택
      Step2Template.tsx           # Step 2: 템플릿 선택
      Step3Copy.tsx               # Step 3: 문구 편집
      Step4Preview.tsx            # Step 4: 미리보기
      Step5Export.tsx             # Step 5: 내보내기
    slides/
      SlideWrapper.tsx            # 슬라이드 공통 컨테이너
      SlideTypeA.tsx              # TYPE A: 문제 해결형 슬라이드
      SlideTypeB.tsx              # TYPE B: 규격 설명형 슬라이드
      SlideTypeC.tsx              # TYPE C: 제품 소개형 슬라이드

lib/
  cardnews/
    types.ts                      # CardNews 관련 TypeScript 타입 정의
    playwright.ts                 # Playwright PNG 렌더링 유틸리티
    brand.ts                      # 브랜드 설정 관리
    ai.ts                         # Claude Sonnet API 연동 (Phase 3)
  supabase/
    database.types.ts             # 자동 생성 타입 (card_news_* 테이블 포함)
    server.ts                     # getCardNewsProducts 등 조회 함수 추가
```
