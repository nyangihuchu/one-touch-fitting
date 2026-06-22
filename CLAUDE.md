# CLAUDE.md

이 파일은 이 저장소에서 작업하는 Claude Code (claude.ai/code)에게 제공되는 가이드입니다.

## 프로젝트 개요

Next.js 15와 Supabase를 사용한 풀스택 내부 운영 도구입니다. 원터치 피팅 제품 DB 관리, SUPERFIX 상세페이지 자동 생성, 인스타그램 카드뉴스 자동 생성 3가지 기능을 제공합니다.

### 세부 기능

| 기능 | 라우트 | 상태 | 로드맵 |
|------|--------|------|--------|
| 제품 DB 조회 (Research / My) | `/products/*` | ✅ 완료 | `ROADMAP.md` |
| SUPERFIX 상세페이지 자동 생성 | `/superfix/*` | 🔄 진행중 (38%) | `ROADMAP_DETAIL.md` |
| SUPERFIX 카드뉴스 자동 생성 | `/cardnews/*` | ⬜ 계획 | `ROADMAP_CARDNEWS.md` |

## 명령어

```bash
npm run dev      # localhost:3000에서 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

테스트 환경은 구성되어 있지 않습니다. 변경사항은 개발 서버를 직접 실행하여 확인하세요.

## 아키텍처

**스택:** Next.js 15 (App Router) + Supabase + Tailwind CSS v4 + shadcn/ui (new-york 스타일) + Playwright

**필수 환경 변수:**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

`lib/utils.ts:hasEnvVars`는 환경 변수가 없을 때 튜토리얼 UI를 숨기는 용도로, 온보딩을 위한 임시 처리입니다.

### Supabase 클라이언트 패턴

두 개의 별도 클라이언트를 상황에 맞게 사용해야 합니다:

- **서버** (`lib/supabase/server.ts`): `next/headers` 쿠키를 사용하는 async `createClient()` — Server Component, Route Handler, Server Action에서 사용. Fluid compute 제약으로 인해 전역 변수에 저장하지 않도록 주의.
- **클라이언트** (`lib/supabase/client.ts`): `createBrowserClient`를 통한 sync `createClient()` — `"use client"` 컴포넌트에서 사용.

### 인증 아키텍처

세션 관리는 `proxy.ts`(Next.js 미들웨어 역할)를 통해 이루어지며, 내부적으로 `lib/supabase/proxy.ts:updateSession`을 호출합니다. 모든 요청마다 클라이언트 생성 직후 `supabase.auth.getClaims()`를 호출하여 세션을 갱신합니다. `createServerClient`와 `getClaims()` 사이에 코드를 추가하면 사용자가 무작위로 로그아웃될 수 있으니 주의하세요.

인증 라우트는 `app/auth/` 아래에 있습니다:

- `/auth/login` → `LoginForm` 클라이언트 컴포넌트
- `/auth/sign-up` → `SignUpForm` 클라이언트 컴포넌트
- `/auth/forgot-password` / `/auth/update-password` — 비밀번호 재설정 플로우
- `/auth/confirm` — 이메일 OTP 검증을 위한 Route Handler (`token_hash` + `type` 파라미터)
- `/auth/error` — 에러 표시 페이지

프록시는 `/`, `/auth/*`, `/login` 이외의 모든 비인증 요청을 `/auth/login`으로 리다이렉트합니다.

### 라우트 구조

```
/                          — 공개 랜딩 페이지
/auth/*                    — 인증 관련 (로그인, 회원가입, 비밀번호 재설정)

/products/research         — Research 제품 목록 (필터/검색/페이지네이션)
/products/my               — My 제품 목록 + 상세 모달
/products/guide            — 피팅 가이드 (정적 콘텐츠)

/superfix                  — SUPERFIX 상세페이지 생성 (5단계 스텝퍼)
/superfix/history          — 생성 이력 (계획)

/cardnews/dashboard        — 카드뉴스 현황 대시보드 (계획)
/cardnews/products         — 상품 관리 (계획)
/cardnews/images           — 이미지 현황 (계획)
/cardnews/generate         — 카드뉴스 생성 (계획)
/cardnews/download         — 생성 결과 다운로드 (계획)
/cardnews/settings         — 브랜드 설정 (계획)
```

### 데이터베이스

`lib/supabase/database.types.ts`는 자동 생성된 TypeScript 스키마입니다. 스키마 변경 후에는 Supabase MCP 도구(`generate_typescript_types`)로 재생성하세요.

**현재 테이블:**

| 테이블 | 설명 | 행 수 |
|--------|------|-------|
| `profiles` | 인증 유저와 1:1 연결 (트리거 자동 생성) | - |
| `research_products` | 경쟁사 리서치 제품 데이터 | ~500건 |
| `my_products` | 자사 판매 제품 데이터 | 536건 (중복 제거 완료) |

**계획 중인 테이블 (`ROADMAP_CARDNEWS.md` Phase 2):**

| 테이블 | 설명 |
|--------|------|
| `card_news_templates` | 카드뉴스 템플릿 타입(A/B/C) 구성 |
| `card_news_jobs` | 카드뉴스 생성 작업 이력 |
| `copy_rules` | 제품 타입별 슬라이드 문구 규칙 |

### my_products 주요 컬럼

| 컬럼 | 설명 |
|------|------|
| `product_name` | 제품명 |
| `model` | 모델명 (예: PC04-M5) |
| `tube_spec` | 튜브규격 (예: 4mm) |
| `thread_spec` | 나사규격 (예: M5, R(PT)1/4) |
| `shape` | 피팅 형태 |
| `image_path` | 외부 이미지 URL (cretec.kr CDN) |
| `sale_price` | 판매가 |
| `supply_price` | 원가 |
| `consumer_price` | 소비자가 |
| `detail_description` | HTML 상세설명 |
| `search_keywords` | SEO 검색키워드 |

### SUPERFIX 상세페이지 생성 현황

`/superfix` 라우트에서 My 제품을 선택하면 HTML 상세페이지를 자동 생성합니다.

**핵심 파일:**
- `components/superfix/SuperfixWizard.tsx` — 5단계 스텝퍼 메인 컴포넌트
- `lib/superfix/transformer.ts` — `my_products` → `ProductJSON` 변환
- `lib/superfix/default-content.ts` — AI 없이 규칙 기반 콘텐츠 생성 (현재 사용 중)
- `lib/superfix/html-generator.ts` — HTML 상세페이지 생성
- `lib/superfix/templates/detail-page.ts` — 860px 고정 템플릿 (8개 섹션)
- `app/api/superfix/generate-content/route.ts` — OpenAI API 연동 (보존, 비활성화 상태)
- `app/api/superfix/generate-html/route.ts` — HTML 생성 API

**AI 비활성화 메모:** 현재 `generateDefaultContent()`로 로컬 콘텐츠 생성 중. OpenAI 재활성화 시 `SuperfixWizard.tsx`의 `handleGenerate()`에서 `/api/superfix/generate-content` 호출로 교체.

**다음 작업:** `ROADMAP_DETAIL.md` Task 009 (Playwright 이미지 렌더링 API)

### 카드뉴스 기능 계획

`/cardnews` 라우트는 아직 구현되지 않았습니다.

- **이미지 전략:** `my_products.image_path` 외부 URL 직접 사용 (별도 업로드 없음)
- **템플릿 3종:** TYPE A(문제 해결형), TYPE B(규격 설명형), TYPE C(제품 소개형)
- **출력:** 1080×1350 PNG, ZIP 다운로드
- **렌더링:** Playwright HTML → PNG (상세페이지 생성과 동일한 방식)
- **PRD:** `docs/superfix-cardnews.md`
- **로드맵:** `ROADMAP_CARDNEWS.md`

### 컴포넌트 규칙

- `components/ui/`의 UI 기본 요소는 shadcn 컴포넌트 — 추가 시 `npx shadcn add <컴포넌트명>` 사용
- `lib/utils.ts`의 `cn()`으로 Tailwind 클래스 병합 (clsx + tailwind-merge)
- 아이콘은 `lucide-react` 사용
- 테마 전환은 `next-themes`를 통해 처리하며, 다크 모드는 `class` 전략 사용

### 경로 별칭

`@/`는 프로젝트 루트를 가리킵니다. 모든 내부 임포트에 사용하세요.

### 코드 스타일

- 들여쓰기: 스페이스 2칸
- 세미콜론 없음
- 작은따옴표 사용
- 주석 및 커밋 메시지: 한국어
