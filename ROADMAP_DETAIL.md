# SUPERFIX Product Detail Generator 개발 로드맵

상품 데이터 입력만으로 산업용 부품 상세페이지를 수초 내에 자동 생성하는 SaaS 플랫폼

---

## 프로젝트 개요

### 목적

산업용 부품(에어피팅, 공압피팅, 에어호스, 밸브, 퀵커플러 등)의 상품 데이터를 입력하면 쇼핑몰 상세페이지를 자동 생성하는 SaaS 플랫폼을 구축한다.

### 최종 목표

**상세페이지 1개 제작 시간: 수시간 → 수초**

사용자는 상품 데이터와 이미지만 제공한다. 시스템이 자동으로 다음을 수행한다.

- 상품명 생성 (AI)
- SEO 키워드 생성 (AI)
- 요약설명 / 특징 / 구매전확인사항 생성 (AI)
- 사용예시 이미지 생성 (Google Imagen 4)
- HTML 상세페이지 생성
- PNG / JPG 렌더링 (Playwright)
- 카페24 / 쿠팡 / 스마트스토어 업로드 데이터 생성

### 핵심 철학

> **디자인은 고정하고 데이터만 변경한다.**

하나의 고정 템플릿을 사용하며, 변경되는 요소는 제품명 / 모델명 / 규격 / 제품 이미지 / 치수도 / 스펙 정보뿐이다.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript, React 19 |
| 스타일링 | Tailwind CSS v4, shadcn/ui (new-york) |
| 백엔드 | Next.js API Routes, Node.js |
| 데이터베이스 | Supabase (PostgreSQL, Auth, RLS) |
| AI 텍스트 | GPT-5.5 (상품명, SEO, 설명, 특징, 구매전확인사항) |
| AI 이미지 | Google Imagen 4 (사용예시 이미지 생성) |
| 렌더링 | Playwright (HTML → JPG / PNG) |
| 호스팅 | Vercel + Supabase |

---

## 전체 진행률

| Phase | 설명 | 작업 수 | 완료 | 진행률 |
|-------|------|---------|------|--------|
| Phase 0 | MVP 기반 — My 제품 연동 및 AI 생성 | 6 | 6 | 100% |
| Phase 1 | 상세페이지 생성 — HTML / 이미지 / 다운로드 | 5 | 2 | 40% |
| Phase 2 | 쇼핑몰 데이터 생성 — 카페24 / 쿠팡 / 스마트스토어 | 4 | 0 | 0% |
| Phase 3 | 자동화 확장 — 영상 생성 및 API 연동 | 3 | 0 | 0% |
| Phase 4 | 플랫폼 확장 — 멀티 브랜드 / 고급 기능 | 3 | 0 | 0% |
| **전체** | | **21** | **8** | **38%** |

---

## Batch Processing Flow (My 제품 활용 버전)

원래 PRD의 STEP 1(엑셀 업로드)은 이미 구현된 "My 제품" 기능으로 대체한다.

```
[My 제품 페이지]
      │
      ▼
STEP 1: 제품 선택
  - 사용자가 My 제품 목록에서 상세페이지를 생성할 제품 선택
  - 단일 선택 또는 다중 선택(체크박스) 지원
  - 선택된 제품 수 및 목록 미리보기 표시
      │
      ▼
STEP 2: JSON 변환
  - 선택된 제품의 기존 DB 데이터를 내부 JSON 구조로 자동 변환
  - my_products 테이블 컬럼 → JSON 필드 매핑
    (model, tube_spec, thread_spec, shape, recommended_use 등)
  - 1개 제품 = 1개 JSON 객체
      │
      ▼
STEP 3: AI 콘텐츠 생성
  - GPT-5.5가 JSON 데이터 기반으로 자동 생성
    - 상품명 (쇼핑몰 최적화)
    - 요약설명 (3줄 이내)
    - 특징 4개
    - 구매전확인사항
    - SEO 키워드 목록
  - 사용예시 이미지: Google Imagen 4 생성 또는 기존 이미지 사용
      │
      ▼
STEP 4: HTML 상세페이지 생성
  - 고정 템플릿에 JSON 데이터 + AI 콘텐츠 주입
  - 860px 폭, Industrial/Professional 스타일
  - output.html 생성
      │
      ▼
STEP 5: 이미지 렌더링 (Playwright)
  - HTML → JPG 변환
  - HTML → PNG 변환
      │
      ▼
STEP 6: 쇼핑몰 데이터 생성
  - 카페24 업로드 엑셀 생성
  - 쿠팡 업로드 엑셀 생성
  - 스마트스토어 업로드 엑셀 생성
      │
      ▼
STEP 7: 다운로드
  - HTML 파일 다운로드
  - JPG / PNG 이미지 다운로드
  - 쇼핑몰별 업로드 엑셀 다운로드
```

### 현재 구현 현황 메모

> **[2026-06-14] AI 없이 상세페이지 생성 가능하도록 변경**
>
> STEP 3 AI 콘텐츠 생성 단계를 **규칙 기반 기본 콘텐츠 생성**으로 대체하여 OpenAI 크레딧 없이도 즉시 상세페이지 생성이 가능하다.
>
> - **현재**: `lib/superfix/default-content.ts`의 `generateDefaultContent()` 함수로 로컬에서 콘텐츠 생성
>   - `features[4]`: 제품 규격 기반 4개 특징 자동 생성
>   - `checkBeforeBuy`: 공압 부품 공통 구매 전 확인사항 3개 고정
> - **AI 재활성화 방법**: `SuperfixWizard.tsx`의 `handleGenerate()` 내부에서 `generateDefaultContent()` 호출 부분을 `/api/superfix/generate-content` API 호출로 교체하고 `OPENAI_API_KEY` 환경변수 설정
> - **관련 파일**: `components/superfix/SuperfixWizard.tsx`, `lib/superfix/default-content.ts`, `app/api/superfix/generate-content/route.ts` (보존됨)

---

### My 제품 → JSON 컬럼 매핑표

| my_products 컬럼 | JSON 필드 | 설명 |
|-----------------|-----------|------|
| `product_name` | `product.title` | 제품명 |
| `model` | `product.model` | 모델명 |
| `tube_spec` | `product.tubeSize` | 튜브규격 |
| `thread_spec` | `product.threadSize` | 나사규격 |
| `shape` | `product.type` | 형태 |
| `recommended_use` | `product.recommendedUse` | 추천용도 |
| `category` | `product.category` | 카테고리 |
| `image_path` | `product.mainImage` | 대표상품이미지 |
| `option_name` | `product.options` | 옵션정보 |
| `search_keywords` | `seo.keywords` | 검색키워드 |

---

## 상세페이지 섹션 구조

**폭:** 860px
**스타일:** Industrial / Clean / Professional / B2B Product Catalog

| 섹션 | 이름 | 구성 요소 |
|------|------|----------|
| Section 01 | Hero | 브랜드 로고, 제품명, 모델명, 핵심 카피, 제품 이미지 |
| Section 02 | Features | AI 생성 4개 특징 (원터치 연결, 밀폐성, 내구성, 반복 사용) |
| Section 03 | Specification | 모델명, 타입, 튜브규격, 나사규격, 압력, 온도, 재질 스펙 테이블 |
| Section 04 | Dimension | 치수도 이미지 |
| Section 05 | Usage | 사용예시 이미지 (실린더, 밸브, 에어건, 콤프레샤, 자동화설비) |
| Section 06 | Check Before Buy | AI 생성 구매전확인사항 |
| Section 07 | Option Table | 옵션 정보 테이블 |
| Section 08 | Footer | SUPERFIX PNEUMATIC SOLUTION |

---

## 개발 단계

---

### Phase 0: MVP 기반 — My 제품 연동 및 AI 생성

> **목표:** 기존 My 제품 기능과 연동하여 제품을 선택하고, AI로 상세페이지 콘텐츠를 자동 생성하는 핵심 파이프라인을 구축한다.

#### Phase 0 진행률

| 작업 수 | 완료 | 진행률 |
|---------|------|--------|
| 6 | 6 | 100% |

---

#### ✅ Task 001: SUPERFIX 제너레이터 라우트 및 UI 골격 구성

- 관련 파일: `app/superfix/page.tsx` (신규), `app/superfix/layout.tsx` (신규), `components/superfix/` (신규 디렉토리)
- 예상 소요 시간: 2시간

**구현 사항**

- `/superfix` 라우트 신규 생성 (인증 보호 적용)
- 상세페이지 생성 워크플로우 UI 골격 구성 (5단계 스텝 표시)
  - Step 1: 제품 선택
  - Step 2: 데이터 확인 및 수정
  - Step 3: AI 콘텐츠 생성
  - Step 4: 미리보기
  - Step 5: 다운로드
- 공통 레이아웃 및 네비게이션에 "상세페이지 생성" 메뉴 링크 추가
- 빈 플레이스홀더 페이지로 전체 플로우 경험 가능하도록 구성

**완료 기준**

- `/superfix` 접근 시 5단계 스텝 UI가 렌더링됨
- 비로그인 접근 시 `/auth/login`으로 리다이렉트 확인
- 네비게이션에서 해당 메뉴 접근 가능

---

#### ✅ Task 002: My 제품 다중 선택 UI 구현

- 관련 파일: `components/products/MyProductTable.tsx`, `components/superfix/ProductSelector.tsx` (신규), `app/superfix/page.tsx`
- 예상 소요 시간: 3시간

**구현 사항**

- `MyProductTable` 컴포넌트에 체크박스 컬럼 추가 (선택 모드 prop으로 제어)
- `ProductSelector` 컴포넌트 구현
  - My 제품 목록을 체크박스와 함께 표시
  - 전체 선택 / 전체 해제 기능
  - 선택된 제품 수 실시간 표시 ("3개 제품 선택됨")
  - 최대 선택 제한 설정 가능 (MVP: 10개)
  - 선택 목록 요약 패널 (선택된 제품명, 모델명 표시)
- `/superfix` 페이지 Step 1에 `ProductSelector` 통합
- "다음 단계" 버튼 — 1개 이상 선택 시 활성화

**완료 기준**

- 체크박스로 단일 / 다중 제품 선택 가능
- 선택된 제품 목록이 요약 패널에 표시됨
- 선택 없이 "다음" 클릭 시 경고 메시지 표시

---

#### ✅ Task 003: 제품 데이터 JSON 변환 로직 구현

- 관련 파일: `lib/superfix/types.ts` (신규), `lib/superfix/transformer.ts` (신규)
- 예상 소요 시간: 2시간

**구현 사항**

- `lib/superfix/types.ts` 신규 생성
  - `ProductJSON` 인터페이스 정의 (내부 JSON 구조)
  - `GeneratorJob` 타입 (단일 제품 처리 단위)
  - `GeneratorBatch` 타입 (다중 제품 배치 처리)
  - `AIGeneratedContent` 타입 (AI 생성 콘텐츠)
  - `DetailPageData` 타입 (HTML 생성에 필요한 전체 데이터)

```typescript
// ProductJSON 구조 예시
interface ProductJSON {
  brand: {
    name: string        // 'SUPERFIX'
    subtitle: string    // 'PNEUMATIC SOLUTION'
  }
  product: {
    title: string       // product_name
    model: string       // model
    tubeSize: string    // tube_spec
    threadSize: string  // thread_spec
    type: string        // shape
    recommendedUse: string // recommended_use
    category: string    // category
    mainImage: string   // image_path
    options: string     // option_name
  }
  seo: {
    keywords: string[]  // search_keywords 파싱
  }
}
```

- `lib/superfix/transformer.ts` 신규 생성
  - `transformMyProductToJSON(product: MyProduct): ProductJSON` 함수 구현
  - `transformBatch(products: MyProduct[]): ProductJSON[]` 함수 구현
  - `search_keywords` 문자열 → 배열 파싱 유틸리티
  - 필수 필드 누락 시 기본값 처리 로직

**완료 기준**

- `transformMyProductToJSON` 호출 시 올바른 JSON 구조 반환
- 누락 필드에 대한 기본값 처리 확인
- TypeScript 타입 오류 없음

---

#### ✅ Task 004: 데이터 확인 및 수정 UI 구현

- 관련 파일: `components/superfix/DataReviewPanel.tsx` (신규), `app/superfix/page.tsx`
- 예상 소요 시간: 3시간

**구현 사항**

- `/superfix` Step 2 — 데이터 확인 및 수정 패널 구현
- `DataReviewPanel` 컴포넌트 구현
  - 변환된 JSON 데이터를 폼 형태로 표시
  - 각 필드 인라인 편집 가능 (Input, Select 등)
  - 필수 입력값 누락 시 경고 표시
    - 브랜드명, 제품명, 모델명, 튜브규격, 나사규격, 형태, 추천용도, 대표상품이미지
  - 제품 이미지 미리보기 (image_path 기반)
  - 다중 선택 시 제품별 탭 또는 아코디언으로 구성
- "AI 콘텐츠 생성" 버튼 — 필수값 모두 입력 시 활성화

**완료 기준**

- 선택된 제품 데이터가 편집 가능한 폼으로 표시됨
- 필수 필드 누락 시 해당 필드 강조 및 경고 메시지 표시
- 수정된 데이터가 상태로 유지됨

---

#### ✅ Task 005: AI 텍스트 생성 API 구현

- 관련 파일: `app/api/superfix/generate-content/route.ts` (신규), `lib/superfix/ai.ts` (신규)
- 예상 소요 시간: 4시간

**구현 사항**

- `lib/superfix/ai.ts` 신규 생성
  - OpenAI GPT-5.5 클라이언트 설정
  - `generateProductContent(json: ProductJSON): Promise<AIGeneratedContent>` 함수
  - 프롬프트 템플릿 설계
    - 상품명 생성: 쇼핑몰 검색 최적화 형식 (예: "원터치 에어피팅 PC 타입 8mm R(PT)1/4")
    - 요약설명 생성: 3줄 이내, 규격 중심
    - 특징 4개 생성: 원터치 연결, 밀폐성, 내구성, 반복 사용 등 산업용 키워드 기반
    - 구매전확인사항: 튜브규격, 나사규격 확인 등 실용적 내용
    - SEO 키워드 목록: 모델명, 규격, 브랜드명 포함
  - 에러 처리 및 재시도 로직

- `app/api/superfix/generate-content/route.ts` 신규 생성
  - POST 메서드 — `{ products: ProductJSON[] }` 수신
  - 배치 처리 (제품별 순차 또는 병렬 처리)
  - 처리 상태 스트리밍 응답 (Server-Sent Events)
  - 응답: `{ results: { productId: string, content: AIGeneratedContent }[] }`
  - 인증 미들웨어 적용 (로그인 사용자만 접근 가능)

- 환경 변수 추가
  - `OPENAI_API_KEY`

**완료 기준**

- POST `/api/superfix/generate-content` 호출 시 AI 생성 콘텐츠 반환
- 상품명, 요약설명, 특징 4개, 구매전확인사항, SEO 키워드 모두 생성됨
- 에러 발생 시 적절한 오류 메시지 반환

## 테스트 체크리스트 (Task 005)

- [ ] 정상 입력 → AI 콘텐츠 정상 생성 확인
- [ ] 필수 필드 누락 입력 → 400 에러 반환 확인
- [ ] OpenAI API 키 미설정 → 500 에러 반환 확인
- [ ] 비인증 요청 → 401 에러 반환 확인
- [ ] 다중 제품(3개) 배치 처리 → 모든 제품 콘텐츠 생성 확인
- [ ] 생성된 상품명에 모델명 및 규격 포함 여부 확인
- [ ] 특징이 정확히 4개 생성되는지 확인

---

#### ✅ Task 006: AI 이미지 생성 API 구현

- 관련 파일: `app/api/superfix/generate-image/route.ts` (신규), `lib/superfix/imagen.ts` (신규)
- 예상 소요 시간: 3시간

**구현 사항**

- `lib/superfix/imagen.ts` 신규 생성
  - Google Imagen 4 클라이언트 설정
  - `generateUsageImage(product: ProductJSON): Promise<string>` 함수
  - 프롬프트: 산업용 배경 + 제품 사용예시 (실린더, 밸브, 에어건, 콤프레샤, 자동화설비)
  - 생성된 이미지 Supabase Storage 업로드 후 URL 반환

- `app/api/superfix/generate-image/route.ts` 신규 생성
  - POST 메서드 — `{ productId: string, json: ProductJSON }` 수신
  - 이미지 생성 후 Supabase Storage에 저장
  - 저장 경로: `superfix/usage-images/{productId}.png`
  - 응답: `{ imageUrl: string }`
  - 인증 미들웨어 적용

- 환경 변수 추가
  - `GOOGLE_AI_API_KEY`

**완료 기준**

- POST `/api/superfix/generate-image` 호출 시 이미지 URL 반환
- 생성된 이미지가 Supabase Storage에 저장됨
- 이미지 URL로 접근 가능

## 테스트 체크리스트 (Task 006)

- [ ] 정상 입력 → 이미지 URL 반환 확인
- [ ] 반환된 URL로 이미지 접근 가능 여부 확인
- [ ] Supabase Storage에 파일 저장 확인
- [ ] 비인증 요청 → 401 에러 반환 확인
- [ ] API 키 미설정 → 500 에러 반환 확인

---

### Phase 1: 상세페이지 생성 — HTML / 이미지 / 다운로드

> **목표:** AI 생성 콘텐츠를 바탕으로 860px 폭의 HTML 상세페이지를 생성하고, Playwright로 JPG/PNG 이미지를 렌더링하여 다운로드할 수 있도록 구현한다.

#### Phase 1 진행률

| 작업 수 | 완료 | 진행률 |
|---------|------|--------|
| 5 | 2 | 40% |

---

#### ✅ Task 007: HTML 상세페이지 템플릿 구현

- 관련 파일: `lib/superfix/templates/detail-page.ts` (신규), `lib/superfix/html-generator.ts` (신규)
- 예상 소요 시간: 6시간

**구현 사항**

- `lib/superfix/templates/detail-page.ts` 신규 생성
  - 860px 폭 고정 HTML 템플릿 (인라인 CSS 포함)
  - Industrial / Clean / Professional 스타일 적용
  - 8개 섹션 템플릿 함수 구현
    - `renderHeroSection(data)` — 브랜드 로고, 제품명, 모델명, 핵심 카피, 제품 이미지
    - `renderFeaturesSection(data)` — 4개 특징 카드
    - `renderSpecificationSection(data)` — 스펙 테이블
    - `renderDimensionSection(data)` — 치수도 이미지 (없을 경우 플레이스홀더)
    - `renderUsageSection(data)` — 사용예시 이미지
    - `renderCheckBeforeBuySection(data)` — 구매전확인사항
    - `renderOptionTableSection(data)` — 옵션 테이블
    - `renderFooterSection(data)` — SUPERFIX PNEUMATIC SOLUTION

- `lib/superfix/html-generator.ts` 신규 생성
  - `generateDetailPageHTML(data: DetailPageData): string` 함수
  - 8개 섹션을 순서대로 조합하여 완성된 HTML 문서 반환
  - 이미지 URL을 Base64로 임베드하는 옵션 지원 (다운로드용)

**완료 기준**

- `generateDetailPageHTML` 호출 시 유효한 HTML 문자열 반환
- 브라우저에서 열었을 때 8개 섹션이 860px 폭으로 렌더링됨
- 제품 이미지, 브랜드명, 모델명이 올바른 위치에 표시됨

---

#### ✅ Task 008: HTML 생성 API 및 미리보기 구현

- 관련 파일: `app/api/superfix/generate-html/route.ts` (신규), `components/superfix/DetailPagePreview.tsx` (신규), `app/superfix/page.tsx`
- 예상 소요 시간: 4시간

**구현 사항**

- `app/api/superfix/generate-html/route.ts` 신규 생성
  - POST 메서드 — `{ data: DetailPageData }` 수신
  - `generateDetailPageHTML` 호출 후 HTML 문자열 반환
  - 응답: `{ html: string }`

- `components/superfix/DetailPagePreview.tsx` 신규 생성
  - `<iframe>` 또는 `dangerouslySetInnerHTML`로 생성된 HTML 미리보기
  - 860px 폭 기준으로 스케일 조정 (뷰포트 내 축소 표시)
  - 로딩 스피너 표시

- `/superfix` Step 4 — 미리보기 화면 구현
  - 생성된 HTML 미리보기 렌더링
  - "HTML 다운로드" / "이미지 생성" 버튼
  - 재생성 버튼 (AI 콘텐츠 또는 데이터 수정으로 돌아가기)

**완료 기준**

- POST `/api/superfix/generate-html` 호출 시 HTML 반환
- 미리보기 화면에서 생성된 상세페이지가 렌더링됨
- 860px 폭의 레이아웃이 올바르게 표시됨

## 테스트 체크리스트 (Task 008)

- [x] AI 생성 콘텐츠 주입 후 HTML 정상 생성 확인 (규칙 기반 기본 콘텐츠로 대체 검증 완료)
- [x] 미리보기에서 모든 섹션(8개) 표시 확인
- [x] 제품 이미지가 올바른 위치에 표시 확인
- [ ] 다중 제품 처리 시 각 제품별 HTML 정상 생성 확인

---

#### ⏳ Task 009: Playwright 이미지 렌더링 API 구현

- 관련 파일: `app/api/superfix/render-image/route.ts` (신규), `lib/superfix/playwright-renderer.ts` (신규)
- 예상 소요 시간: 5시간

**구현 사항**

- `lib/superfix/playwright-renderer.ts` 신규 생성
  - Playwright 설치 및 Vercel 환경 설정 (`@playwright/test` 또는 `playwright-core`)
  - `renderHTMLToImage(html: string, format: 'jpg' | 'png'): Promise<Buffer>` 함수
  - 860px 뷰포트 고정 설정
  - 전체 페이지 스크린샷 (full page capture)
  - JPG 품질 설정 (90%)
  - 폰트 로딩 대기 옵션

- `app/api/superfix/render-image/route.ts` 신규 생성
  - POST 메서드 — `{ html: string, format: 'jpg' | 'png', productId: string }` 수신
  - Playwright로 이미지 렌더링
  - Supabase Storage 저장 (`superfix/detail-images/{productId}.jpg`)
  - 응답: `{ imageUrl: string }`
  - 인증 미들웨어 적용

- Vercel 빌드 설정
  - `playwright-core` + `chromium` 번들 설정 (Vercel Serverless 함수 크기 제한 고려)
  - 대안: 별도 렌더링 서버 또는 외부 렌더링 서비스 활용 검토

**완료 기준**

- POST `/api/superfix/render-image` 호출 시 이미지 URL 반환
- 생성된 이미지에서 860px 폭의 상세페이지 확인
- JPG / PNG 두 포맷 모두 생성 가능

## 테스트 체크리스트 (Task 009)

- [ ] HTML 입력 → JPG 이미지 생성 및 URL 반환 확인
- [ ] HTML 입력 → PNG 이미지 생성 및 URL 반환 확인
- [ ] 생성된 이미지 해상도가 860px 폭인지 확인
- [ ] Supabase Storage에 파일 저장 확인
- [ ] Vercel 배포 환경에서 Playwright 정상 동작 확인
- [ ] 비인증 요청 → 401 에러 반환 확인

---

#### ⏳ Task 010: 다운로드 기능 구현

- 관련 파일: `app/api/superfix/download/route.ts` (신규), `components/superfix/DownloadPanel.tsx` (신규), `app/superfix/page.tsx`
- 예상 소요 시간: 3시간

**구현 사항**

- `app/api/superfix/download/route.ts` 신규 생성
  - GET 메서드 — `?type=html|jpg|png&productId=xxx`
  - Supabase Storage에서 파일 조회 후 다운로드 응답
  - `Content-Disposition: attachment` 헤더 설정
  - 파일명 형식: `{모델명}_{타입}.{확장자}` (예: `PC08-02_detail.jpg`)

- `components/superfix/DownloadPanel.tsx` 신규 생성
  - 다운로드 옵션 UI (HTML / JPG / PNG)
  - 다중 제품 선택 시 ZIP으로 묶어서 다운로드
  - 다운로드 진행 상태 표시
  - 각 파일별 미리보기 썸네일

- `/superfix` Step 5 — 다운로드 화면 구현
  - 생성 완료 요약 (처리된 제품 수, 생성된 파일 목록)
  - 개별 다운로드 / 전체 다운로드(ZIP) 버튼
  - "처음으로" 버튼 (새 제품 처리 시작)

**완료 기준**

- HTML / JPG / PNG 개별 다운로드 가능
- 다중 제품 처리 시 ZIP 다운로드 가능
- 다운로드된 파일이 올바른 콘텐츠를 포함함

## 테스트 체크리스트 (Task 010)

- [ ] HTML 파일 다운로드 후 브라우저에서 열었을 때 상세페이지 정상 표시 확인
- [ ] JPG 이미지 다운로드 후 파일 확인
- [ ] PNG 이미지 다운로드 후 파일 확인
- [ ] 3개 제품 선택 후 ZIP 다운로드 → 3개 파일 포함 확인
- [ ] 파일명 형식 확인 (모델명 포함)

---

#### ⏳ Task 011: 생성 이력 저장 및 조회 기능 구현

- 관련 파일: `app/api/superfix/history/route.ts` (신규), `app/superfix/history/page.tsx` (신규), Supabase SQL
- 예상 소요 시간: 3시간

**구현 사항**

- Supabase에 `generation_history` 테이블 추가
  - 컬럼: id, product_id, model, html_url, jpg_url, png_url, ai_content, created_at, user_id
  - RLS: 로그인 사용자 본인 데이터만 조회/삽입 가능

- 생성 완료 시 이력 자동 저장
  - `app/api/superfix/history/route.ts` — POST(저장), GET(조회)

- `app/superfix/history/page.tsx` 신규 생성
  - 이전에 생성한 상세페이지 이력 목록 표시
  - 모델명, 생성일시, 파일 다운로드 링크
  - 재다운로드 기능

**완료 기준**

- 상세페이지 생성 완료 후 이력이 DB에 저장됨
- 이력 페이지에서 이전 생성 목록 조회 가능
- 이전 생성 파일 재다운로드 가능

---

### Phase 2: 쇼핑몰 데이터 생성

> **목표:** 생성된 상세페이지 콘텐츠를 각 쇼핑몰(카페24, 쿠팡, 스마트스토어) 업로드 형식에 맞는 엑셀 파일로 변환하여 제공한다.

#### Phase 2 진행률

| 작업 수 | 완료 | 진행률 |
|---------|------|--------|
| 4 | 0 | 0% |

---

#### ⏳ Task 012: 쇼핑몰 데이터 스키마 설계 및 변환 로직 구현

- 관련 파일: `lib/superfix/shop-schemas/` (신규 디렉토리), `lib/superfix/shop-transformer.ts` (신규)
- 예상 소요 시간: 4시간

**구현 사항**

- 각 쇼핑몰별 업로드 엑셀 컬럼 구조 분석 및 타입 정의
  - `lib/superfix/shop-schemas/cafe24.ts` — 카페24 상품 업로드 형식
  - `lib/superfix/shop-schemas/coupang.ts` — 쿠팡 Wing 업로드 형식
  - `lib/superfix/shop-schemas/smartstore.ts` — 스마트스토어 업로드 형식

- `lib/superfix/shop-transformer.ts` 신규 생성
  - `transformToCafe24(data: DetailPageData): Cafe24Product` 함수
  - `transformToCoupang(data: DetailPageData): CoupangProduct` 함수
  - `transformToSmartstore(data: DetailPageData): SmartstoreProduct` 함수
  - AI 생성 콘텐츠 → 각 쇼핑몰 필드 매핑
    - 상품명, 카테고리, 옵션, 상세설명 URL, 검색키워드, 이미지 URL 등

**완료 기준**

- 각 쇼핑몰 변환 함수 호출 시 해당 형식의 데이터 객체 반환
- TypeScript 타입 오류 없음

---

#### ⏳ Task 013: 쇼핑몰별 엑셀 생성 API 구현

- 관련 파일: `app/api/superfix/generate-excel/route.ts` (신규), `lib/superfix/excel-generator.ts` (신규)
- 예상 소요 시간: 4시간

**구현 사항**

- `xlsx` 또는 `exceljs` 패키지 설치
- `lib/superfix/excel-generator.ts` 신규 생성
  - `generateExcel(rows: object[], sheetName: string): Buffer` 함수
  - 각 쇼핑몰 형식에 맞는 헤더 스타일 적용
  - 다중 제품 배치 처리 (여러 제품을 하나의 엑셀 파일에)

- `app/api/superfix/generate-excel/route.ts` 신규 생성
  - POST 메서드 — `{ products: DetailPageData[], shopType: 'cafe24' | 'coupang' | 'smartstore' }` 수신
  - 변환 → 엑셀 생성 → Buffer 반환
  - 응답: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - 파일명: `superfix_{shopType}_{날짜}.xlsx`

**완료 기준**

- 카페24 / 쿠팡 / 스마트스토어별 엑셀 파일 생성 가능
- 다중 제품이 하나의 엑셀 파일에 포함됨
- 다운로드된 엑셀 파일이 각 쇼핑몰에서 오류 없이 인식됨

## 테스트 체크리스트 (Task 013)

- [ ] 카페24 엑셀 생성 후 필수 컬럼 포함 확인
- [ ] 쿠팡 엑셀 생성 후 필수 컬럼 포함 확인
- [ ] 스마트스토어 엑셀 생성 후 필수 컬럼 포함 확인
- [ ] 3개 제품 → 엑셀 3행 생성 확인
- [ ] AI 생성 상품명이 엑셀에 포함 확인
- [ ] SEO 키워드가 검색어 필드에 포함 확인

---

#### ⏳ Task 014: 쇼핑몰 데이터 생성 UI 구현

- 관련 파일: `components/superfix/ShopDataPanel.tsx` (신규), `app/superfix/page.tsx`
- 예상 소요 시간: 2시간

**구현 사항**

- `components/superfix/ShopDataPanel.tsx` 신규 생성
  - 쇼핑몰 선택 체크박스 (카페24 / 쿠팡 / 스마트스토어)
  - 선택된 쇼핑몰별 엑셀 다운로드 버튼
  - 생성 진행 상태 표시

- `/superfix` Step 5 다운로드 화면에 쇼핑몰 엑셀 다운로드 섹션 추가
  - 이미지 다운로드와 쇼핑몰 엑셀 다운로드를 탭 또는 섹션으로 구분

**완료 기준**

- 쇼핑몰 선택 후 엑셀 다운로드 버튼 활성화
- 다운로드 진행 상태 표시
- 3개 쇼핑몰 각각 독립적으로 다운로드 가능

---

#### ⏳ Task 015: 전체 워크플로우 통합 테스트

- 관련 파일: 전체 superfix 관련 파일
- 예상 소요 시간: 3시간

**구현 사항**

- My 제품 선택 → JSON 변환 → AI 생성 → HTML 생성 → 이미지 렌더링 → 다운로드 전체 플로우 검증
- 단일 제품 및 다중 제품(3개, 10개) 시나리오 테스트
- 에러 케이스 테스트 (이미지 없는 제품, 필수 필드 누락 등)
- 성능 측정 (제품 1개 기준 전체 소요 시간 목표: 30초 이내)
- `npm run build` 빌드 오류 없음 확인

## 테스트 체크리스트 (Task 015)

- [ ] 단일 제품 전체 플로우 완료 시간 측정 (목표: 30초 이내)
- [ ] 3개 제품 배치 처리 전체 플로우 확인
- [ ] HTML 다운로드 후 브라우저 렌더링 정상 확인
- [ ] JPG/PNG 이미지 품질 및 해상도 확인
- [ ] 카페24/쿠팡/스마트스토어 엑셀 파일 구조 검증
- [ ] 이미지 없는 제품 처리 → 플레이스홀더 표시 확인
- [ ] 네트워크 오류 시 재시도 또는 에러 메시지 표시 확인
- [ ] Vercel 배포 환경에서 전체 플로우 재확인

---

### Phase 3: 자동화 확장

> **목표:** 영상 자동 생성 및 외부 API 직접 연동을 통해 쇼핑몰 업로드 자동화를 구현한다.

#### Phase 3 진행률

| 작업 수 | 완료 | 진행률 |
|---------|------|--------|
| 3 | 0 | 0% |

---

#### ⏳ Task 016: 15초 숏폼 영상 자동 생성 (Phase 3 - 영상)

- 관련 파일: `lib/superfix/video-generator.ts` (신규), `app/api/superfix/generate-video/route.ts` (신규)
- 예상 소요 시간: 1주

**구현 사항**

- 상품 이미지 기반 15초 숏폼 영상 자동 생성
- 슬라이드쇼 형식 (Hero → Features → Spec → Usage)
- 텍스트 오버레이 (상품명, 모델명, 핵심 특징)
- 배경 음악 또는 무음 옵션
- MP4 포맷 출력
- 영상 편집 라이브러리 검토: `remotion`, `ffmpeg-wasm`

**완료 기준**

- 상품 데이터 입력 → 15초 MP4 영상 자동 생성
- 영상에 상품명, 모델명, 4개 특징이 순서대로 표시됨
- 다운로드 가능한 MP4 파일 제공

---

#### ⏳ Task 017: 카페24 API 직접 연동

- 관련 파일: `lib/superfix/shop-apis/cafe24.ts` (신규), `app/api/superfix/upload-cafe24/route.ts` (신규)
- 예상 소요 시간: 1주

**구현 사항**

- 카페24 Open API 인증 (OAuth 2.0)
- 상품 자동 등록 API 연동
  - 상품 기본 정보 등록
  - 상세페이지 이미지 업로드
  - 옵션 등록
- 연동 설정 UI (카페24 쇼핑몰 도메인, API 키 입력)

---

#### ⏳ Task 018: 쿠팡 / 스마트스토어 API 연동

- 관련 파일: `lib/superfix/shop-apis/coupang.ts` (신규), `lib/superfix/shop-apis/smartstore.ts` (신규)
- 예상 소요 시간: 2주

**구현 사항**

- 쿠팡 Wing API 연동
  - 상품 자동 등록
  - 이미지 업로드
  - 아이템 관리

- 스마트스토어 API 연동
  - 상품 자동 등록
  - 상세 설명 이미지 업로드
  - 카테고리 매핑

---

### Phase 4: 플랫폼 확장

> **목표:** 멀티 브랜드 지원 및 고급 기능을 추가하여 외부 셀러도 사용할 수 있는 SaaS 플랫폼으로 확장한다.

#### Phase 4 진행률

| 작업 수 | 완료 | 진행률 |
|---------|------|--------|
| 3 | 0 | 0% |

---

#### ⏳ Task 019: 멀티 브랜드 지원

- 관련 파일: `lib/superfix/templates/` 디렉토리 구조 확장
- 예상 소요 시간: 1주

**구현 사항**

- 브랜드별 템플릿 관리 시스템
  - SUPERFIX 템플릿 (기본)
  - DAITEM 템플릿
  - OEM 브랜드 커스텀 템플릿
- 브랜드별 색상 / 폰트 / 로고 설정
- 템플릿 선택 UI
- 브랜드별 프롬프트 커스터마이징

**완료 기준**

- 브랜드 선택 후 해당 브랜드 스타일의 상세페이지 생성됨
- 브랜드 로고가 Header/Footer에 올바르게 표시됨

---

#### ⏳ Task 020: 외부 셀러 온보딩 및 구독 플랜

- 관련 파일: `app/pricing/page.tsx` (신규), `lib/billing/` (신규 디렉토리)
- 예상 소요 시간: 2주

**구현 사항**

- 회원가입 → 플랜 선택 → 결제 → 사용 시작 온보딩 플로우
- 구독 플랜 설계
  - Free: 월 5회 생성
  - Basic: 월 50회 생성
  - Pro: 무제한 생성 + API 연동
- 결제 시스템 연동 (Stripe 또는 토스페이먼츠)
- 사용량 제한 미들웨어
- 관리자 대시보드 (사용자 관리, 사용량 통계)

---

#### ⏳ Task 021: 고급 분석 및 최적화

- 관련 파일: `app/analytics/page.tsx` (신규)
- 예상 소요 시간: 1주

**구현 사항**

- 생성 이력 통계 대시보드
  - 월별 생성 건수
  - 쇼핑몰별 업로드 건수
  - AI 생성 비용 추적

- A/B 테스트 기능
  - 동일 제품에 대해 다른 AI 프롬프트로 2개 상품명 생성 후 비교

- 성능 최적화
  - AI 생성 결과 캐싱 (동일 모델 재처리 시 캐시 활용)
  - 배치 처리 병렬화 (현재 순차 → 병렬 전환)

---

## 개발 워크플로우

### 1. 작업 계획

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP_DETAIL.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

### 2. 작업 생성

- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `014-superfix-route.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- API / 비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오)

### 3. 작업 구현

- 작업 파일의 명세서를 따름
- 기능 구현 완료 후 테스트 체크리스트 항목 검증
- API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 E2E 테스트 수행
- 각 단계 완료 후 작업 파일 내 진행 상황 업데이트
- 각 단계 완료 후 중단하고 추가 지시를 기다림

### 4. 로드맵 업데이트

- `ROADMAP_DETAIL.md`에서 완료된 작업을 ✅로 표시
- Phase 진행률 테이블 업데이트

---

## 상태 아이콘 범례

- `⏳` 대기 (미시작)
- `🔄` 진행 중
- `✅` 완료

---

## MVP 제외 항목 (향후 개발)

| 기능 | 설명 | 예상 Phase |
|------|------|-----------|
| 치수도 자동 생성 | AI로 치수도 이미지 자동 생성 | Phase 4 |
| 다국어 상세페이지 | 영어 / 중국어 버전 자동 생성 | Phase 4 |
| 상세페이지 A/B 테스트 | 다른 레이아웃 / 카피 비교 | Phase 4 |
| 모바일 최적화 버전 | 360px 폭 모바일 상세페이지 별도 생성 | Phase 4 |
| 상세페이지 버전 관리 | 이전 버전과 비교 / 롤백 | Phase 4 |

---

## 관련 파일 구조 (구현 예상)

```
app/
  superfix/
    page.tsx                    # 메인 워크플로우 페이지 (5단계)
    layout.tsx                  # superfix 레이아웃
    history/
      page.tsx                  # 생성 이력 페이지
  api/
    superfix/
      generate-content/
        route.ts                # AI 텍스트 생성 API
      generate-image/
        route.ts                # AI 이미지 생성 API
      generate-html/
        route.ts                # HTML 생성 API
      render-image/
        route.ts                # Playwright 렌더링 API
      download/
        route.ts                # 파일 다운로드 API
      generate-excel/
        route.ts                # 쇼핑몰 엑셀 생성 API
      history/
        route.ts                # 생성 이력 API

components/
  superfix/
    ProductSelector.tsx         # My 제품 선택 (체크박스)
    DataReviewPanel.tsx         # 데이터 확인 및 수정 폼
    DetailPagePreview.tsx       # HTML 상세페이지 미리보기
    DownloadPanel.tsx           # 다운로드 옵션 패널
    ShopDataPanel.tsx           # 쇼핑몰 엑셀 다운로드 패널

lib/
  superfix/
    types.ts                    # ProductJSON, DetailPageData 등 타입 정의
    transformer.ts              # MyProduct → ProductJSON 변환
    ai.ts                       # GPT-5.5 텍스트 생성
    imagen.ts                   # Google Imagen 4 이미지 생성
    html-generator.ts           # HTML 상세페이지 생성
    playwright-renderer.ts      # HTML → JPG/PNG 렌더링
    excel-generator.ts          # 쇼핑몰 엑셀 생성
    shop-transformer.ts         # DetailPageData → 쇼핑몰 형식 변환
    templates/
      detail-page.ts            # 860px HTML 템플릿 (8개 섹션)
    shop-schemas/
      cafe24.ts                 # 카페24 업로드 스키마
      coupang.ts                # 쿠팡 업로드 스키마
      smartstore.ts             # 스마트스토어 업로드 스키마
```
