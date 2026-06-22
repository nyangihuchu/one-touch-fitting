# PRD - SUPERFIX CardNews Factory

## 프로젝트 개요

### 프로젝트명

SUPERFIX CardNews Factory

### 목적

SUPERFIX 에어피팅 및 공압부품 상품 데이터를 기반으로 인스타그램 카드뉴스를 자동 생성하는 내부 운영 시스템 구축

목표는 AI가 콘텐츠를 작성하는 것이 아니라,

상품 DB + 제품 이미지 + 템플릿을 조합하여

수천~수만 개 상품의 카드뉴스를 자동 생성하는 것이다.

---

# 핵심 목표

현재

상품 등록
→ 상세페이지 제작
→ SNS 카드뉴스 제작

과정이 모두 수작업이다.

목표

상품 데이터 1건 입력

↓

카드뉴스 5장 자동 생성

↓

PNG 다운로드

↓

인스타 업로드

---

# 운영 대상

브랜드

SUPERFIX

쇼핑몰

https://daitem.co.kr

제품군

- 원터치 피팅
- 금속 피팅
- 특수 피팅
- 에어호스
- 커플링
- 니플
- 공압부품

---

# MVP 범위

## 포함

- 상품 DB 관리
- 상품 이미지 관리
- 카드뉴스 자동 생성
- PNG 다운로드

## 제외

- 인스타 자동 업로드
- 예약 발행
- 콘텐츠 캘린더
- 통계 분석

MVP에서는 생성에 집중

---

# 가장 중요한 원칙

AI는 보조 기능이다.

주 시스템은

상품 DB

↓

템플릿 엔진

↓

카드뉴스 생성

이다.

AI가 없어도 카드뉴스 생성이 가능해야 한다.

---

# 상품 데이터 구조

필수 컬럼

model

product_name

tube_size

thread_size

type

usage

image_url

category

예시

{
"model":"PC04-M5",
"product_name":"원터치 피팅",
"tube_size":"4mm",
"thread_size":"M5",
"type":"PC",
"usage":"공압배관",
"image_url":"pc04-m5.png"
}

---

# 상품 업로드

지원

CSV

XLSX

대량 업로드 가능

최소 100,000건 이상 처리 가능

---

# 이미지 관리

상품별 이미지 연결

예시

PC04-M5

↓

PC04-M5.png

배경제거 지원

선택사항

원본 유지

---

# 카드뉴스 템플릿

## TYPE A

문제 해결형

1장

4mm 호스 연결,
뭘 써야 할까?

2장

잘못 선택하면
에어 누설 발생

3장

PC04-M5 사용

4장

공압배관
자동화설비

5장

SUPERFIX

---

## TYPE B

규격 설명형

1장

PT1/8
PT1/4

무슨 차이일까?

2장

규격 설명

3장

사용 예시

4장

추천 제품

5장

SUPERFIX

---

## TYPE C

제품 소개형

1장

PC04-M5

2장

주요 특징

3장

규격 정보

4장

사용 분야

5장

SUPERFIX

---

# 자동 문구 규칙

PC 타입

4mm 호스 연결,
뭘 써야 할까?

PL 타입

좁은 공간이라면?

PY 타입

호스를 분기해야 한다면?

PB 타입

배관 방향을 바꿔야 한다면?

PWT 타입

2개 방향을 동시에 연결해야 한다면?

타입별 기본 문구 보유

AI는 문구 개선만 수행

---

# 디자인 규칙

크기

1080 x 1350

인스타 피드 최적화

브랜드 컬러

Primary

#FF6A00

Secondary

#111111

Background

#FFFFFF

폰트

Pretendard

---

# 슬라이드 레이아웃

상단

SUPERFIX 로고

중앙

제품 이미지

전체 영역 60%

하단

설명 문구

CTA

daitem.co.kr

---

# 기술 스택

Frontend

Next.js 15

TypeScript

TailwindCSS

Shadcn UI

Backend

Supabase

Storage

Supabase Storage

Image Engine

Playwright

HTML → PNG 렌더링

AI

Claude Sonnet

선택 기능

---

# 페이지 구성

/dashboard

전체 현황

/products

상품 관리

/images

이미지 관리

/templates

카드뉴스 템플릿 관리

/generate

카드뉴스 생성

/download

생성 결과 다운로드

/settings

브랜드 설정

---

# 카드뉴스 생성 프로세스

상품 선택

↓

템플릿 선택

↓

문구 자동 생성

↓

미리보기

↓

PNG 생성

↓

ZIP 다운로드

---

# 개발 우선순위

Phase 1

상품 DB

이미지 관리

Phase 2

카드뉴스 템플릿

PNG 생성

Phase 3

AI 문구 생성

Phase 4

인스타 업로드

Phase 5

예약 발행

---

# 성공 기준

PC04-M5 선택

↓

1분 이내

↓

카드뉴스 5장 생성

↓

ZIP 다운로드 가능

이를 기준으로 MVP 완료 판정
