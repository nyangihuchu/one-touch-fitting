# SUPERFIX Product Detail Generator PRD

## 1. Project Overview

### 프로젝트명

SUPERFIX Product Detail Generator

### 프로젝트 목적

산업용 부품(에어피팅, 공압피팅, 에어호스, 밸브, 퀵커플러 등)의 상품 데이터를 입력하면 상세페이지를 자동 생성하는 SaaS 플랫폼을 구축한다.

사용자는 상품 데이터와 이미지만 업로드한다.

시스템은 자동으로

- 상품명 생성
- SEO 생성
- 요약설명 생성
- 상세설명 생성
- HTML 상세페이지 생성
- PNG/JPG 상세페이지 생성
- 카페24 업로드 데이터 생성
- 쿠팡 업로드 데이터 생성
- 스마트스토어 업로드 데이터 생성

을 수행한다.

---

## 2. Core Philosophy

### 디자인은 고정하고 데이터만 변경한다.

매 상품마다 상세페이지를 새로 디자인하지 않는다.

하나의 고정 템플릿을 사용한다.

변경되는 요소는 다음뿐이다.

- 제품명
- 모델명
- 옵션명
- 규격
- 제품 이미지
- 치수도
- 스펙정보

예시

PC08-02 → PC06-01

8mm → 6mm

R(PT)1/4 → R(PT)1/8

직선 수나사형 → 엘보형

제품 이미지 변경

치수도 변경

---

## 3. Target Users

### 1차

SUPERFIX 운영자

### 2차

산업용 부품 판매자

### 3차

온라인 셀러

- 쿠팡
- 스마트스토어
- 카페24
- 자사몰

---

## 4. Technical Stack

### Frontend

- Next.js
- TypeScript
- TailwindCSS

### Backend

- Next.js API
- Node.js

### Database

- Supabase

### AI

#### Text Generation

GPT-5.5

용도

- 상품명 생성
- SEO 생성
- 상품설명 생성
- 특징 생성
- 구매전 확인사항 생성

#### Image Generation

Google Imagen 4

용도

- 사용예시 이미지 생성
- 산업용 배경 이미지 생성

### Rendering

Playwright

용도

- HTML → JPG
- HTML → PNG

### Hosting

- Vercel
- Supabase

---

## 5. Input Structure

### Required Inputs

브랜드명

제품명

모델명

튜브규격

나사규격

형태

추천용도

대표상품이미지

예시

브랜드명

SUPERFIX

제품명

원터치 에어피팅

모델명

PC08-02

튜브규격

8mm

나사규격

R(PT)1/4

형태

직선 수나사형

추천용도

실린더 연결

대표이미지

제품 누끼 이미지

---

## 6. Optional Inputs

### 치수도

dimension image

### 사용예시 이미지

- 실린더
- 솔레노이드밸브
- 에어건
- 콤프레샤
- 자동화설비

### 스펙표

- 압력
- 온도
- 재질

### 옵션정보

### 검색키워드

### 주의사항

---

## 7. Internal JSON Structure

```json
{
  "brand": {
    "name": "SUPERFIX",
    "subtitle": "PNEUMATIC SOLUTION"
  },
  "product": {
    "title": "원터치 에어피팅",
    "model": "PC08-02",
    "tubeSize": "8mm",
    "threadSize": "R(PT)1/4",
    "type": "직선 수나사형"
  }
}
```

모든 상세페이지는 내부적으로 JSON 기반으로 생성한다.

---

## 8. Auto Generated Content

AI가 자동 생성한다.

### 상품명

예시

원터치 에어피팅 PC 타입 8mm R(PT)1/4

### 요약설명

호스외경 8mm

나사규격 R(PT)1/4

직선 수나사형

### 특징

- 원터치 연결
- 강력한 밀폐력
- 황동 바디
- 반복 사용 가능

### 구매 전 확인사항

- 튜브 규격 확인
- 나사 규격 확인

### SEO 키워드

- 에어피팅
- 원터치피팅
- 공압피팅
- PC08-02
- PT1/4
- SUPERFIX

---

## 9. Detail Page Layout

상세페이지 폭

860px

스타일

Industrial

Clean

Professional

B2B Product Catalog

---

### Section 01 Hero

구성

- 브랜드 로고
- 제품명
- 모델명
- 핵심 카피
- 제품 이미지

---

### Section 02 Features

4개 특징

- 원터치 연결
- 밀폐성
- 내구성
- 반복 사용

---

### Section 03 Specification

스펙 테이블

- 모델명
- 타입
- 튜브규격
- 나사규격
- 압력
- 온도
- 재질

---

### Section 04 Dimension

치수도

---

### Section 05 Usage

사용예시

- 실린더
- 밸브
- 에어건
- 콤프레샤
- 자동화설비

---

### Section 06 Check Before Buy

구매 전 확인사항

---

### Section 07 Option Table

옵션 정보

---

### Section 08 Footer

SUPERFIX

PNEUMATIC SOLUTION

---

## 10. Batch Processing Flow

### STEP 1

엑셀 업로드

products.xlsx

---

### STEP 2

상품 데이터 읽기

---

### STEP 3

상품별 JSON 생성

1 상품 = 1 JSON

---

### STEP 4

AI 콘텐츠 생성

- 상품명
- SEO
- 특징
- 상세설명
- 구매전 확인사항

---

### STEP 5

HTML 상세페이지 생성

output.html

---

### STEP 6

이미지 렌더링

Playwright

출력

- JPG
- PNG

---

### STEP 7

쇼핑몰 데이터 생성

카페24

쿠팡

스마트스토어

업로드 엑셀 생성

---

## 11. MVP Scope

MVP에서 반드시 구현

### 상품 관리

- 상품 등록
- 상품 수정
- 상품 삭제

### 엑셀 업로드

- XLSX 업로드
- 일괄 상품 생성

### AI 생성

- 상품명
- SEO
- 설명

### 상세페이지 생성

- HTML
- PNG
- JPG

### 다운로드

- HTML 다운로드
- 이미지 다운로드

---

## 12. Future Roadmap

### Phase 2

영상 자동 생성

상품 이미지 기반

15초 숏폼 자동 생성

### Phase 3

카페24 API 연동

### Phase 4

쿠팡 API 연동

### Phase 5

스마트스토어 API 연동

### Phase 6

멀티 브랜드 지원

- SUPERFIX
- DAITEM
- OEM 브랜드

---

## Final Goal

사용자는 상품 데이터와 이미지만 업로드한다.

시스템은 자동으로

- 상품명 생성
- SEO 생성
- 상세설명 생성
- HTML 생성
- PNG 생성
- JPG 생성
- 쇼핑몰 업로드 데이터 생성

까지 자동 수행한다.

최종 목표는 산업용 부품 상세페이지를 1개 제작하는데 걸리는 시간을 수시간에서 수초 수준으로 줄이는 것이다.
