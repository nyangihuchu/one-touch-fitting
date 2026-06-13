# Development Guidelines — One Touch Fitting 제품 DB 관리 시스템

## 1. 프로젝트 개요

- **목적**: 원터치 피팅 제품 데이터를 Supabase DB에 적재하고 두 개 메뉴(Research 제품 / My 제품)로 조회·검색하는 내부 관리 도구 MVP
- **스택**: Next.js 15 App Router · TypeScript · Supabase (PostgreSQL + Auth + RLS) · Tailwind CSS v4 · shadcn/ui (new-york) · Lucide React
- **배포**: Vercel
- **테스트**: 테스트 환경 없음. 변경사항은 `npm run dev` 개발 서버로 직접 확인

---

## 2. 디렉토리 구조 규칙

```
app/
  auth/           ← 인증 라우트 전용. 신규 인증 라우트는 여기에만 추가
  products/
    research/     ← Research 제품 페이지 (앞으로 생성)
    my/           ← My 제품 페이지 (앞으로 생성)
  protected/      ← 기존 보호 페이지. 제품 기능과 무관
  page.tsx        ← 공개 랜딩 페이지. 건드리지 말 것

components/
  ui/             ← shadcn 자동 생성 파일만. 직접 수정 금지
  products/       ← 제품 관련 컴포넌트 (앞으로 생성)
  *.tsx           ← 공통 컴포넌트 (auth-button, theme-switcher 등)

lib/
  supabase/
    server.ts     ← 서버 전용 클라이언트 + 데이터 조회 함수
    client.ts     ← 브라우저 전용 클라이언트
    proxy.ts      ← 미들웨어 세션 갱신. 절대 변경 금지
    database.types.ts ← 자동 생성. 직접 수정 금지
  products/
    types.ts      ← 제품 관련 TypeScript 타입 (앞으로 생성)
    utils.ts      ← 제품 관련 유틸리티 함수 (앞으로 생성)
  utils.ts        ← cn() 유틸리티, hasEnvVars. 변경 시 주의
```

### 신규 파일 위치 규칙

- 페이지 → `app/[route]/page.tsx` (Server Component 기본)
- 인터랙티브 컴포넌트 → `components/products/*.tsx` + 파일 상단 `"use client"` 선언
- 순수 서버 데이터 조회 함수 → `lib/supabase/server.ts`에 추가
- 제품 타입 정의 → `lib/products/types.ts`
- 가격·날짜 포맷 유틸리티 → `lib/products/utils.ts`

---

## 3. Supabase 클라이언트 규칙

### ⚠️ 클라이언트 선택 규칙 (위반 시 세션 오류 발생)

| 컨텍스트 | 사용할 클라이언트 | import 경로 |
|----------|------------------|-------------|
| Server Component | `async createClient()` | `@/lib/supabase/server` |
| Route Handler | `async createClient()` | `@/lib/supabase/server` |
| Server Action | `async createClient()` | `@/lib/supabase/server` |
| `"use client"` 컴포넌트 | `createClient()` (sync) | `@/lib/supabase/client` |

### 금지 규칙

- **전역 변수에 Supabase 클라이언트 저장 금지** — Fluid Compute 환경에서 요청 간 상태 공유로 인한 세션 오염
- **Server Component에서 `@/lib/supabase/client` import 금지**
- **`"use client"` 컴포넌트에서 `@/lib/supabase/server` import 금지**

```ts
// ✅ 올바른 Server Component 패턴
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient(); // 함수 내부에서 매번 생성
  const { data } = await supabase.from("research_products").select("*");
}

// ❌ 금지 — 전역 저장
const supabase = await createClient(); // 모듈 최상단 금지
```

---

## 4. 인증 및 미들웨어 규칙

### proxy.ts 수정 금지 사항

- **`lib/supabase/proxy.ts`의 `createServerClient()` 호출과 `supabase.auth.getClaims()` 호출 사이에 코드 추가 금지**
- 이 두 줄 사이에 코드를 삽입하면 사용자가 무작위로 로그아웃됨

```ts
// ✅ 현재 proxy.ts 구조 — 사이에 코드 삽입 금지
const supabase = createServerClient(...);
// ← 여기에 절대 코드 추가 금지
const { data } = await supabase.auth.getClaims();
```

### 인증 보호 동작

- `/`, `/auth/*`, `/login` 이외의 **모든 경로는 자동으로 인증 필수**
- `/products/*` 경로는 별도 설정 없이 기존 미들웨어로 보호됨
- 새 공개 경로 추가 시 `proxy.ts`의 조건문에 pathname 예외 추가 필요

### 인증 라우트 목록

- `/auth/login` — 로그인
- `/auth/sign-up` — 회원가입
- `/auth/forgot-password` — 비밀번호 재설정 요청
- `/auth/update-password` — 비밀번호 변경
- `/auth/confirm` — 이메일 OTP 검증 (Route Handler)
- `/auth/error` — 에러 표시

---

## 5. 데이터 조회 함수 규칙

- **모든 DB 조회 함수는 `lib/supabase/server.ts`에 작성**
- 함수 시그니처: 파라미터 타입 명시, 반환 타입 명시
- 페이지네이션은 Supabase `.range(from, to)` 사용
- 검색은 `.ilike('column', '%keyword%')` 사용 (대소문자 무관)
- 필터 옵션 목록은 별도 함수로 분리 (distinct 쿼리)

```ts
// ✅ 올바른 패턴
export async function getResearchProducts({
  category,
  tubeSpec,
  threadSpec,
  search,
  page = 1,
  pageSize = 50,
}: ProductFilterParams) {
  const supabase = await createClient();
  let query = supabase.from("research_products").select("*", { count: "exact" });

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("product_name", `%${search}%`);
  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  return query;
}
```

---

## 6. DB 스키마 변경 시 동기화 규칙

**Supabase에서 테이블/컬럼을 추가·변경한 후 반드시 아래 순서로 동기화:**

1. Supabase MCP `generate_typescript_types` 호출
2. 생성된 타입을 `lib/supabase/database.types.ts`에 반영
3. `lib/products/types.ts`의 타입이 `database.types.ts`와 일치하는지 확인
4. `npm run build` 타입 오류 없음 확인

- **`database.types.ts` 직접 편집 금지** — 항상 자동 생성으로만 갱신

---

## 7. 컴포넌트 규칙

### shadcn/ui 컴포넌트 추가

```bash
# 반드시 이 명령어로만 추가
npx shadcn add <컴포넌트명>

# 예시
npx shadcn add table
npx shadcn add select
npx shadcn add dialog
```

- **`components/ui/` 내 파일 직접 수정 금지** — shadcn 재설치 시 덮어씌워짐
- 스타일 커스터마이징은 상위 컴포넌트에서 className prop으로 처리

### 컴포넌트 분류 기준

| 분류 | 위치 | 특성 |
|------|------|------|
| shadcn 기본 컴포넌트 | `components/ui/` | 수정 금지 |
| 제품 기능 컴포넌트 | `components/products/` | 클라이언트/서버 혼재 가능 |
| 공통 레이아웃 컴포넌트 | `components/*.tsx` | 서버 컴포넌트 우선 |

### Server vs Client Component 판단

- **기본: Server Component** (async, 데이터 fetch 가능)
- `"use client"` 선언 조건: `onClick`, `useState`, `useEffect`, `useRouter`, `useSearchParams` 사용 시

---

## 8. 코드 스타일 규칙

Prettier 설정(`.prettierrc`) 기준 — 자동 포맷 적용됨:

- 세미콜론: **있음** (`;`)
- 따옴표: **더블쿼트** (`"`)
- 들여쓰기: **스페이스 2칸**
- 최대 줄 길이: **100자**
- Trailing comma: `es5`

### 네이밍 규칙

- 컴포넌트 파일: `PascalCase.tsx` (예: `ResearchProductTable.tsx`)
- 함수/변수: `camelCase`
- 타입/인터페이스: `PascalCase`
- 경로 별칭: `@/`를 프로젝트 루트로 사용 (상대경로 `../` 사용 금지)

```ts
// ✅ 올바른 import
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

// ❌ 금지
import { createClient } from "../../lib/supabase/server";
```

### 아이콘 사용

- **lucide-react만 사용** — 다른 아이콘 라이브러리 설치 금지
- Tailwind 클래스 병합: `cn()` 함수 사용 (`@/lib/utils`)

---

## 9. 가격 표시 규칙

- 가격 컬럼(`consumer_price`, `supply_price`, `sale_price`)은 **반드시 `toLocaleString('ko-KR')` 적용**
- 단위 "원" 접미사 표시
- `lib/products/utils.ts`의 `formatPrice()` 함수 사용

```ts
// ✅ 올바른 가격 표시
formatPrice(product.sale_price) // "1,200원"

// ❌ 금지
product.sale_price // 숫자 그대로 표시
```

---

## 10. 멀티 파일 동시 수정 규칙

| 상황 | 수정 대상 파일 |
|------|--------------|
| Supabase 테이블 추가 | `database.types.ts` 재생성 → `lib/products/types.ts` 업데이트 |
| 새 제품 조회 함수 추가 | `lib/supabase/server.ts` + `lib/products/types.ts` |
| 새 제품 페이지 추가 | `app/products/[route]/page.tsx` + 네비게이션 컴포넌트 |
| shadcn 컴포넌트 추가 | `npx shadcn add` 실행 → `components/ui/` 자동 생성 |
| 공통 필터 컴포넌트 수정 | `components/products/ProductFilter.tsx` (Research/My 양쪽 영향 확인) |

---

## 11. Git 커밋 규칙

- Husky 훅 활성화: `commit-msg`, `pre-commit`, `pre-push`
- **커밋 메시지는 한국어로 작성**
- **`--no-verify` 사용 금지** — 훅을 우회하지 말 것
- 커밋 단위: 기능 단위로 작게 나눌 것

```bash
# ✅ 올바른 커밋 메시지
feat: research 제품 목록 페이지 구현
fix: 필터 쿼리 파라미터 누락 버그 수정
chore: @tailwindcss/typography 패키지 추가

# ❌ 금지
git commit --no-verify
```

---

## 12. 금지 사항

- `lib/supabase/proxy.ts` — `createServerClient`와 `getClaims` 사이에 코드 삽입 금지
- `lib/supabase/database.types.ts` — 직접 편집 금지 (항상 자동 생성)
- `components/ui/` — 직접 수정 금지 (shadcn CLI로만 관리)
- Supabase 클라이언트 전역 변수 저장 금지
- 상대 경로 import 금지 (`../` 대신 `@/` 사용)
- `"use client"` 컴포넌트에서 서버 전용 `next/headers` import 금지
- 이미지 표시 기능 MVP에서 구현 금지 (이미지 경로 텍스트 표시만 허용)
- 모바일 반응형 구현 금지 (데스크탑 1280px 기준)
- 제품 데이터 수정/삭제 기능 구현 금지 (MVP는 읽기 전용)
