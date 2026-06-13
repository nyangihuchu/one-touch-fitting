# One Touch Fitting 제품 DB 관리 시스템 MVP PRD

## 1. 프로젝트 개요

**프로젝트명:** One Touch Fitting 제품 DB 관리 시스템 MVP

**목적:**
원터치 피팅 제품 데이터를 Supabase DB에 적재하고, 리서치 제품(경쟁사 벤치마킹)과 자사 제품(My 제품) 두 가지 관점으로 조회·검색할 수 있는 내부 관리 도구를 구축한다.

**기술 스택:**
- 프론트엔드: Next.js 15 (App Router), TypeScript, React 19
- 스타일링: Tailwind CSS v4, shadcn/ui (new-york 스타일), Lucide React
- 백엔드: Supabase (PostgreSQL, Auth, RLS)
- 배포: Vercel
- 패키지 관리: npm

**타겟 사용자:**
1인 개발자 또는 내부 운영 담당자 — 제품 데이터를 빠르게 조회하고 필터링하여 상품 운영 업무에 활용하는 단일 사용자(또는 소수 내부 인원).

---

## 2. 배경 및 목표

### 문제 정의

현재 원터치 피팅 제품 데이터는 엑셀 파일 두 개(researchproduct.xlsx 500건, myproduct.xlsx 803건)로만 관리되고 있다. 엑셀 기반 관리의 한계는 다음과 같다.

- 카테고리·규격별 필터링이 불편하고 반복 작업이 많다.
- 여러 컬럼에 걸친 키워드 검색이 어렵다.
- 자사 제품의 상세설명(HTML), 가격 정보 등을 한 화면에서 확인하기 번거롭다.
- 데이터가 분산되어 있어 운영 의사결정 속도가 느리다.

### 해결 방향

엑셀 데이터를 Supabase PostgreSQL DB에 일괄 적재하고, 웹 기반 조회·검색·필터 인터페이스를 제공하여 운영 효율을 높인다. MVP에서는 읽기 전용(조회) 기능에 집중하며, 데이터 수정·업로드 기능은 이후 단계로 미룬다.

### 목표

- 엑셀 500건 + 803건 데이터를 Supabase DB로 이관한다.
- Research 제품과 My 제품을 각각 별도 메뉴에서 테이블로 조회한다.
- 카테고리·튜브규격·나사규격 필터와 키워드 검색으로 원하는 제품을 빠르게 찾는다.
- My 제품은 상세 모달로 요약설명, HTML 상세설명, 검색어, 이미지 경로를 확인한다.
- Supabase Auth 인증을 통과한 사용자만 접근 가능하도록 보안을 유지한다.

---

## 3. 사용자 스토리

내부 운영 담당자 관점의 유저 스토리를 정의한다.

**US-001 로그인**
운영 담당자로서, Supabase 이메일/비밀번호 인증으로 로그인하여 제품 DB 관리 화면에 진입하고 싶다. 미인증 상태에서는 모든 제품 페이지에 접근할 수 없어야 한다.

**US-002 Research 제품 목록 조회**
운영 담당자로서, 경쟁사 리서치 제품 500건을 테이블로 조회하고 싶다. 한 번에 전체를 훑기 어려우므로 페이지네이션으로 나눠 볼 수 있어야 한다.

**US-003 Research 제품 필터**
운영 담당자로서, 카테고리·튜브규격·나사규격 드롭다운 필터를 조합하여 특정 사양의 리서치 제품만 추려 보고 싶다.

**US-004 Research 제품 키워드 검색**
운영 담당자로서, 상품명·모델·키워드 컬럼을 대상으로 텍스트를 입력하여 원하는 리서치 제품을 검색하고 싶다.

**US-005 My 제품 목록 조회**
운영 담당자로서, 자사 판매 제품 803건을 테이블로 조회하고 싶다. 판매가·소비자가·공급가가 함께 표시되어야 한다.

**US-006 My 제품 필터**
운영 담당자로서, 카테고리·튜브규격·나사규격 드롭다운 필터를 조합하여 특정 사양의 자사 제품만 추려 보고 싶다.

**US-007 My 제품 키워드 검색**
운영 담당자로서, 상품명·모델 컬럼을 대상으로 텍스트를 입력하여 원하는 자사 제품을 검색하고 싶다.

**US-008 My 제품 상세 모달**
운영 담당자로서, My 제품 목록에서 특정 행을 클릭하면 모달 창이 열려 요약설명·HTML 상세설명·검색어·이미지 경로를 확인하고 싶다.

---

## 4. 기능 요구사항

### 4-1. Research 제품 기능

#### F-R01 제품 목록 테이블

- `research_products` 테이블에서 데이터를 서버 사이드로 조회한다.
- 표시 컬럼 순서:
  1. 판매관리SKU (sales_management_sku)
  2. 카테고리 (category)
  3. 대표상품명 (product_name)
  4. 모델 (model)
  5. 튜브규격 (tube_spec)
  6. 나사규격 (thread_spec)
  7. 형태 (shape)
  8. 옵션명 (option_name)
  9. 판매전략 (sales_strategy)
  10. 키워드 (keywords)
  11. 참조URL (reference_url) — 링크로 표시
- 컬럼 너비는 텍스트 길이에 따라 자동 조절(min-width 설정).
- 참조URL은 `<a target="_blank">` 외부 링크로 렌더링한다.

#### F-R02 필터

- 카테고리, 튜브규격, 나사규격 세 가지 드롭다운 필터를 제공한다.
- 각 필터의 옵션 값은 DB에서 distinct 조회하여 동적으로 생성한다.
- 필터 선택 시 URL 쿼리 파라미터(`?category=...&tube=...&thread=...`)에 반영하여 공유 가능하도록 한다.
- 필터 초기화 버튼으로 전체 목록으로 돌아간다.

#### F-R03 키워드 검색

- 검색 대상 컬럼: `product_name`, `model`, `keywords`
- PostgreSQL `ilike '%검색어%'` 방식으로 대소문자 무관 부분 일치 검색한다.
- 검색어도 URL 쿼리 파라미터(`?q=...`)에 반영한다.
- 필터와 검색어는 AND 조건으로 복합 적용된다.

#### F-R04 페이지네이션

- 한 페이지당 기본 50건을 표시한다.
- 이전/다음 페이지 버튼과 현재 페이지 번호를 표시한다.
- 전체 건수를 헤더 영역에 표시한다 (예: "총 500건 중 1-50건 표시").
- 페이지 번호는 URL 쿼리 파라미터(`?page=...`)에 반영한다.

---

### 4-2. My 제품 기능

#### F-M01 제품 목록 테이블

- `my_products` 테이블에서 데이터를 서버 사이드로 조회한다.
- 표시 컬럼 순서:
  1. 카테고리 (category)
  2. 대표상품명 (product_name)
  3. 모델 (model)
  4. 튜브규격 (tube_spec)
  5. 나사규격 (thread_spec)
  6. 형태 (shape)
  7. 옵션명 (option_name)
  8. 소비자가 (consumer_price) — 숫자 포맷 (원)
  9. 공급가 (supply_price) — 숫자 포맷 (원)
  10. 판매가 (sale_price) — 숫자 포맷 (원)
- 가격 컬럼은 `toLocaleString('ko-KR')` 으로 천 단위 콤마 포맷을 적용한다.
- 행 클릭 시 상세 모달이 열린다.

#### F-M02 필터

- Research 제품과 동일하게 카테고리, 튜브규격, 나사규격 드롭다운 필터를 제공한다.
- 옵션 값은 `my_products` 테이블에서 distinct 조회하여 생성한다.
- URL 쿼리 파라미터에 반영하여 공유 가능하도록 한다.
- 필터 초기화 버튼 제공.

#### F-M03 키워드 검색

- 검색 대상 컬럼: `product_name`, `model`
- PostgreSQL `ilike '%검색어%'` 방식으로 검색한다.
- URL 쿼리 파라미터에 반영한다.
- 필터와 AND 조건으로 복합 적용된다.

#### F-M04 페이지네이션

- Research 제품과 동일한 방식으로 한 페이지당 50건, 이전/다음 버튼, 총 건수 표시.

#### F-M05 상세 모달

- 목록에서 행 클릭 시 shadcn/ui `Dialog` 컴포넌트로 모달이 열린다.
- 모달 내 표시 항목:
  - 대표상품명 (타이틀)
  - 카테고리, 모델, 튜브규격, 나사규격, 형태, 옵션명 (기본 정보 그리드)
  - 소비자가 / 공급가 / 판매가 (가격 정보)
  - 상품 요약설명 (`summary_description`)
  - 상품 상세설명 (`detail_description`) — HTML을 `dangerouslySetInnerHTML`로 렌더링, `prose` 스타일 적용
  - 검색어설정 (`search_keywords`)
  - 이미지 경로 (`image_path`) — 텍스트로 표시
- 모달 외부 클릭 또는 닫기 버튼으로 닫힌다.

---

### 4-3. 데이터 초기 적재 방법 (엑셀 -> Supabase)

MVP에서는 별도 어드민 업로드 UI를 제공하지 않는다. 대신 아래 두 가지 방법 중 하나로 엑셀 데이터를 Supabase DB에 일괄 적재한다.

#### 방법 A: Supabase 대시보드 CSV 임포트 (권장, 간단)

1. 엑셀 파일(.xlsx)을 CSV로 내보낸다 (Excel: 파일 > 다른 이름으로 저장 > CSV UTF-8).
2. Supabase 대시보드 > Table Editor > 해당 테이블 선택 > "Import data from CSV" 클릭.
3. CSV 파일을 업로드하면 컬럼명이 자동으로 매핑된다.
4. 주의: 가격 컬럼(`consumer_price`, `supply_price`, `sale_price`)은 숫자 타입이므로 CSV에서 쉼표·원 기호를 제거한 후 업로드한다.

#### 방법 B: Node.js 스크립트로 일괄 삽입

프로젝트 루트에 `scripts/import-data.ts` 파일을 작성하고 아래 순서로 실행한다.

```
1. xlsx 패키지로 엑셀 파일을 읽는다.
   npm install xlsx

2. 컬럼명을 DB 필드명으로 매핑한다.
   예) '판매관리SKU' -> sales_management_sku

3. Supabase 클라이언트(service_role 키 사용)로 supabase.from('research_products').insert(rows) 를 100건씩 배치 삽입한다.

4. 실행:
   npx ts-node scripts/import-data.ts
```

스크립트에서 사용할 Service Role Key는 Supabase 대시보드 > Project Settings > API 에서 확인하며, `.env.local` 파일에만 저장하고 절대 커밋하지 않는다.

---

## 5. 데이터 모델

### 5-1. research_products 테이블

경쟁사 리서치/벤치마킹 제품 목록을 저장한다.

| 컬럼명 | 타입 | 설명 | 비고 |
|---|---|---|---|
| id | bigint | 기본키 | PK, auto increment |
| sales_management_sku | text | 판매관리SKU | 예: DAITEM-AIR-0001 |
| category | text | 카테고리 | 예: 에어피팅 |
| product_name | text | 대표상품명 | 예: 원터치 에어피팅 PC 타입 4mm M5 |
| model | text | 모델 | 예: PC 04-M5 |
| tube_spec | text | 튜브규격 (호스 외경) | 예: 4mm, 6mm |
| thread_spec | text | 나사규격 | 예: M5, R(PT)1/8 |
| shape | text | 피팅 형태 | 예: 직선 수나사형 원터치 피팅 |
| recommended_use | text | 추천용도 | nullable |
| option_name | text | 옵션명 | 예: 4mm / M5 |
| sales_strategy | text | 판매전략 | 예: 대표상품 옵션형 운영 |
| keywords | text | 검색 키워드 | 쉼표 구분 문자열 |
| reference_url | text | 참조 제품 URL | nullable |
| created_at | timestamptz | 생성일시 | DEFAULT now() |

**인덱스:**

```sql
CREATE INDEX idx_research_category ON research_products(category);
CREATE INDEX idx_research_tube_spec ON research_products(tube_spec);
CREATE INDEX idx_research_thread_spec ON research_products(thread_spec);
CREATE INDEX idx_research_search ON research_products USING gin(
  to_tsvector('simple', coalesce(product_name,'') || ' ' || coalesce(model,'') || ' ' || coalesce(keywords,''))
);
```

**RLS 정책:**

```sql
ALTER TABLE research_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 조회 가능"
  ON research_products FOR SELECT
  TO authenticated
  USING (true);
```

---

### 5-2. my_products 테이블

실제 판매 중인 자사 제품 목록을 저장한다.

| 컬럼명 | 타입 | 설명 | 비고 |
|---|---|---|---|
| id | bigint | 기본키 | PK, auto increment |
| category | text | 카테고리 | |
| product_name | text | 대표상품명 | |
| model | text | 모델 | |
| tube_spec | text | 튜브규격 (호스 외경) | |
| thread_spec | text | 나사규격 | |
| shape | text | 피팅 형태 | |
| recommended_use | text | 추천용도 | nullable |
| option_name | text | 옵션명 | |
| summary_description | text | 상품 요약설명 | nullable |
| detail_description | text | 상품 상세설명 (HTML) | nullable |
| search_keywords | text | 검색어설정 (SEO) | nullable |
| consumer_price | integer | 소비자가 (원) | nullable |
| supply_price | integer | 공급가 (원) | nullable |
| sale_price | integer | 판매가 (원) | nullable |
| image_path | text | 이미지 파일 경로 | nullable |
| created_at | timestamptz | 생성일시 | DEFAULT now() |

**인덱스:**

```sql
CREATE INDEX idx_my_category ON my_products(category);
CREATE INDEX idx_my_tube_spec ON my_products(tube_spec);
CREATE INDEX idx_my_thread_spec ON my_products(thread_spec);
CREATE INDEX idx_my_search ON my_products USING gin(
  to_tsvector('simple', coalesce(product_name,'') || ' ' || coalesce(model,''))
);
```

**RLS 정책:**

```sql
ALTER TABLE my_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "인증된 사용자만 조회 가능"
  ON my_products FOR SELECT
  TO authenticated
  USING (true);
```

---

### 5-3. DDL 전문

아래 SQL을 Supabase 대시보드 > SQL Editor에서 실행하여 테이블을 생성한다.

```sql
-- research_products 테이블 생성
CREATE TABLE research_products (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sales_management_sku text,
  category             text,
  product_name         text,
  model                text,
  tube_spec            text,
  thread_spec          text,
  shape                text,
  recommended_use      text,
  option_name          text,
  sales_strategy       text,
  keywords             text,
  reference_url        text,
  created_at           timestamptz DEFAULT now()
);

ALTER TABLE research_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "인증된 사용자만 조회 가능"
  ON research_products FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_research_category   ON research_products(category);
CREATE INDEX idx_research_tube_spec  ON research_products(tube_spec);
CREATE INDEX idx_research_thread_spec ON research_products(thread_spec);


-- my_products 테이블 생성
CREATE TABLE my_products (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category             text,
  product_name         text,
  model                text,
  tube_spec            text,
  thread_spec          text,
  shape                text,
  recommended_use      text,
  option_name          text,
  summary_description  text,
  detail_description   text,
  search_keywords      text,
  consumer_price       integer,
  supply_price         integer,
  sale_price           integer,
  image_path           text,
  created_at           timestamptz DEFAULT now()
);

ALTER TABLE my_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "인증된 사용자만 조회 가능"
  ON my_products FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_my_category    ON my_products(category);
CREATE INDEX idx_my_tube_spec   ON my_products(tube_spec);
CREATE INDEX idx_my_thread_spec ON my_products(thread_spec);
```

---

## 6. 화면 구성

### 6-1. 전체 레이아웃

```
+--------------------------------------------------+
| [사이드바 or 상단 네비게이션]                      |
|  One Touch Fitting  |  Research 제품 | My 제품    |
+--------------------------------------------------+
| [페이지 콘텐츠 영역]                               |
|                                                  |
+--------------------------------------------------+
```

- 상단 네비게이션 바(헤더): 프로젝트명 로고, "Research 제품" 링크, "My 제품" 링크, 우측에 현재 로그인 사용자 이메일 + 로그아웃 버튼.
- 메인 콘텐츠 영역은 `max-w-screen-2xl mx-auto px-4` 로 중앙 정렬.
- 모바일 반응형은 MVP 범위 외. 데스크탑(1280px 이상) 기준으로 구현.

### 6-2. 로그인 페이지

기존 `app/auth/login` 페이지를 그대로 사용한다. 인증 성공 시 `/products/research` 로 리다이렉트한다.

```
+---------------------------+
| [중앙 정렬 카드]            |
|  이메일 입력               |
|  비밀번호 입력              |
|  [로그인 버튼]             |
+---------------------------+
```

### 6-3. Research 제품 페이지 (/products/research)

```
+--------------------------------------------------+
| 헤더: "Research 제품 목록"  총 N건               |
+--------------------------------------------------+
| [필터 영역 - 가로 배치]                           |
|  카테고리: [Select v]  튜브규격: [Select v]       |
|  나사규격: [Select v]  [필터 초기화]              |
+--------------------------------------------------+
| [검색 영역]                                       |
|  [검색어 입력 Input]  [검색 버튼]                 |
+--------------------------------------------------+
| [데이터 테이블]                                   |
|  판매관리SKU | 카테고리 | 대표상품명 | 모델 | ...  |
|  ------------|----------|------------|-----|      |
|  row data   | ...      | ...        | ... |      |
|  (50행)                                          |
+--------------------------------------------------+
| [페이지네이션]                                    |
|  < 이전  [1] [2] [3] ...  다음 >                 |
+--------------------------------------------------+
```

- 테이블은 shadcn/ui `Table` 컴포넌트 사용.
- 헤더 행은 `sticky top-0` 으로 스크롤 시 고정.
- 참조URL 컬럼은 "링크 열기" 버튼 또는 축약된 URL 텍스트로 표시.
- 긴 텍스트(예: 키워드, 추천용도)는 `truncate max-w-[200px]` 으로 줄임 처리, 호버 시 툴팁으로 전체 내용 표시.

### 6-4. My 제품 페이지 (/products/my)

Research 제품 페이지와 동일한 필터·검색·페이지네이션 레이아웃.

```
+--------------------------------------------------+
| 헤더: "My 제품 목록"  총 N건                     |
+--------------------------------------------------+
| [필터 영역]  카테고리 | 튜브규격 | 나사규격 | 초기화 |
+--------------------------------------------------+
| [검색 영역]  [Input]  [검색 버튼]                |
+--------------------------------------------------+
| [데이터 테이블]                                   |
|  카테고리 | 대표상품명 | 모델 | 튜브 | 나사 | ...  |
|  판매가   | 소비자가   | 공급가                   |
|  (행 클릭 -> 상세 모달 오픈)                     |
+--------------------------------------------------+
| [페이지네이션]                                    |
+--------------------------------------------------+
```

### 6-5. My 제품 상세 모달

```
+--------------------------------------------+
| [Dialog]  대표상품명                   [X] |
|--------------------------------------------|
| [기본 정보 그리드 2열]                       |
|  카테고리: ...     모델: ...               |
|  튜브규격: ...     나사규격: ...            |
|  형태: ...         옵션명: ...             |
|--------------------------------------------|
| [가격 정보 3열]                             |
|  소비자가: 0원  공급가: 0원  판매가: 0원    |
|--------------------------------------------|
| [상품 요약설명]                              |
|  텍스트...                                  |
|--------------------------------------------|
| [상품 상세설명] (HTML 렌더링, prose 스타일)  |
|  <html content>                            |
|--------------------------------------------|
| [검색어설정]                                |
|  텍스트...                                  |
|--------------------------------------------|
| [이미지 경로]                               |
|  텍스트...                                  |
|--------------------------------------------|
|                              [닫기 버튼]   |
+--------------------------------------------+
```

- `Dialog` 크기: `max-w-3xl`, 내부 스크롤 가능(`overflow-y-auto max-h-[80vh]`).
- HTML 상세설명은 `@tailwindcss/typography` 플러그인의 `prose` 클래스를 적용하여 가독성을 높인다.

---

## 7. 비기능 요구사항

### 7-1. 인증 및 접근 제어

- 기존 `proxy.ts` 미들웨어가 비인증 요청을 `/auth/login`으로 리다이렉트하는 로직을 그대로 활용한다.
- `/products/research`, `/products/my` 경로는 인증 필수 경로로 미들웨어 보호 대상에 포함한다.
- Supabase RLS 정책으로 DB 레벨에서도 `authenticated` 롤만 SELECT 가능하도록 이중 보안을 적용한다.
- Service Role Key는 서버 사이드 전용으로만 사용하며, 클라이언트 노출 금지.

### 7-2. 성능

- 데이터 조회는 Server Component에서 Supabase 서버 클라이언트(`lib/supabase/server.ts`)로 처리한다.
- 필터·검색·페이지네이션 파라미터를 URL 쿼리 스트링으로 관리하여 Next.js 캐시와 연동한다.
- 페이지당 50건 제한으로 한 번에 로드하는 데이터 크기를 제한한다.
- 카테고리·튜브규격·나사규격 컬럼에 인덱스를 생성하여 필터 쿼리 성능을 확보한다.
- 필터 옵션 목록(distinct 값)은 별도 쿼리로 사전에 가져와 Select 컴포넌트에 주입한다.

### 7-3. UI 가이드라인

- shadcn/ui 컴포넌트 우선 사용: `Table`, `Select`, `Input`, `Button`, `Dialog`, `Badge`.
- 신규 컴포넌트 추가 시 `npx shadcn add <컴포넌트명>` 명령 사용.
- 색상·간격은 Tailwind CSS 유틸리티 클래스와 프로젝트 기본 테마를 따른다.
- 아이콘은 `lucide-react` 사용 (Search, Filter, X, ExternalLink 등).
- 다크 모드는 기존 `next-themes` 설정을 그대로 활용한다.
- 에러 상태(조회 실패, 빈 결과)는 적절한 빈 상태 UI(EmptyState)로 처리한다.

### 7-4. 코드 컨벤션

- 들여쓰기: 스페이스 2칸, 세미콜론 없음, 작은따옴표 사용.
- 컴포넌트 파일명: PascalCase (예: `ResearchProductTable.tsx`).
- 경로 별칭: `@/` 를 프로젝트 루트로 사용.
- 주석 및 문서: 한국어 작성.

---

## 8. MVP 범위 및 제외 항목

### 포함 기능 (MVP)

| 기능 | 설명 |
|---|---|
| 로그인/로그아웃 | 기존 Supabase Auth 인증 활용 |
| Research 제품 목록 조회 | 테이블, 필터(3종), 키워드 검색, 페이지네이션 |
| My 제품 목록 조회 | 테이블, 필터(3종), 키워드 검색, 페이지네이션 |
| My 제품 상세 모달 | 요약설명, HTML 상세설명, 검색어, 이미지 경로 |
| 데이터 초기 적재 | CSV 임포트 또는 Node.js 스크립트 |
| RLS 보안 | 인증된 사용자만 SELECT 허용 |

### 제외 항목 (MVP 이후)

| 항목 | 이유 |
|---|---|
| 어드민 데이터 업로드 UI | 초기 적재 후 빈도 낮음, 복잡도 높음 |
| 제품 데이터 수정/삭제 | 읽기 전용으로 MVP 충족 |
| 엑셀 내보내기 | 원본 엑셀 파일로 대체 가능 |
| 모바일 반응형 | 내부 도구이므로 데스크탑 우선 |
| 실시간 알림 | 단순 조회 도구에 불필요 |
| 다중 사용자 권한 관리 | 1인 운영 도구 |
| Research-My 제품 비교 기능 | 이후 단계에서 구현 |
| 이미지 실제 표시 | 이미지 파일 경로만 텍스트로 표시 |
| 대시보드/통계 | MVP 외 |

---

## 9. 개발 순서

### 1단계: DB 세팅

목표: Supabase에 테이블을 생성하고 데이터를 적재한다.

1. Supabase 대시보드 > SQL Editor에서 섹션 5-3의 DDL을 실행하여 `research_products`, `my_products` 테이블을 생성한다.
2. RLS 정책이 정상 활성화되었는지 확인한다.
3. 엑셀 파일을 CSV로 변환한 후 섹션 4-3의 방법 A(CSV 임포트) 또는 방법 B(Node.js 스크립트)로 데이터를 적재한다.
4. `generate_typescript_types` (Supabase MCP) 또는 Supabase CLI(`supabase gen types typescript`)로 `lib/supabase/database.types.ts` 를 재생성한다.
5. Supabase 대시보드에서 샘플 행을 조회하여 데이터 정합성을 확인한다.

### 2단계: Research 제품 페이지

목표: `/products/research` 경로에 Research 제품 목록 화면을 구현한다.

1. `app/products/research/page.tsx` Server Component 생성.
2. `lib/supabase/server.ts` 클라이언트로 `research_products` 조회 함수 작성.
   - 필터(category, tube_spec, thread_spec), 키워드 검색(ilike), 페이지네이션(range) 적용.
3. 필터 옵션 distinct 값 조회 함수 작성.
4. `components/products/ResearchProductTable.tsx` 테이블 컴포넌트 구현 (shadcn Table).
5. `components/products/ProductFilter.tsx` 필터 컴포넌트 구현 (shadcn Select).
6. `components/products/ProductSearch.tsx` 검색 컴포넌트 구현 (shadcn Input + Button).
7. `components/products/Pagination.tsx` 페이지네이션 컴포넌트 구현.
8. 헤더 네비게이션에 "Research 제품" 링크 추가.
9. 미들웨어(`proxy.ts`)에서 `/products/*` 경로를 인증 보호 대상으로 확인/추가.
10. 로컬 개발 서버에서 필터·검색·페이지네이션 동작 검증.

### 3단계: My 제품 페이지

목표: `/products/my` 경로에 My 제품 목록 화면과 상세 모달을 구현한다.

1. `app/products/my/page.tsx` Server Component 생성.
2. `lib/supabase/server.ts`에 `my_products` 조회 함수 추가.
   - 필터, 키워드 검색, 페이지네이션 적용.
   - 상세 모달용 단일 행 조회 함수 추가.
3. `components/products/MyProductTable.tsx` 테이블 컴포넌트 구현.
   - 가격 컬럼 숫자 포맷 적용.
   - 행 클릭 이벤트로 상세 모달 오픈.
4. `components/products/MyProductDetailModal.tsx` 상세 모달 구현 (shadcn Dialog).
   - `@tailwindcss/typography` 설치 및 HTML 렌더링 적용.
5. 필터·검색·페이지네이션은 2단계에서 만든 공통 컴포넌트 재사용.
6. 헤더 네비게이션에 "My 제품" 링크 추가.
7. 로컬 개발 서버에서 목록·필터·검색·모달 동작 검증.
8. Vercel 배포 후 운영 환경 최종 확인.
