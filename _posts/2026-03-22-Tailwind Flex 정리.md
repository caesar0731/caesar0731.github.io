---
title: "Tailwind - Flex 정리"
excerpt: "자주 사용하는 flex 클래스를 예시와 함께 정리했습니다."
categories: [CSS]
tags: [tailwind, flex, css, layout]
lastmod: 2026-03-22 01:00:00
sitemap: 
    changefreq : daily
    priority : 0.5
comments: true
published: true
---

# Tailwind - Flex 정리

프로젝트에서 프론트엔드개발자가 인라인으로 작성하기 편하게 tailwind를 선택해서 사용하고 있고

flex로 화면 디자인을 만드는데

느낌대로 감으로 사용하고 있는것같아서

이번기회에 명확하게 예시와 함께 정리해보려고 합니다.

## 1. 컨테이너 & 방향

부모가 flex 클래스를 가지고 있을때 자식 요소들의 방향을 결정합니다.

| 클래스 | CSS | 설명 |
|---|---|---|
| `flex` | `display: flex` | flex 컨테이너 생성 |
| `inline-flex` | `display: inline-flex` | 인라인 flex 컨테이너 생성 |
| `flex-row` | `flex-direction: row` | 가로 배치 (기본값) |
| `flex-col` | `flex-direction: column` | 세로 배치 (자주 사용)|
| `flex-row-reverse` | `flex-direction: row-reverse` | 가로 역순 |
| `flex-col-reverse` | `flex-direction: column-reverse` | 세로 역순 |

```html
<!-- flex-row (기본값) -->
<div class="flex gap-2">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- flex-col -->
<div class="flex flex-col gap-2">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

![flex-direction 시각적 예시](/assets/images/flex/flex-direction.png)

## 2. 주축 정렬 (justify-content)

주축(main axis) 방향으로 아이템을 배치합니다.
`flex-row`이면 가로, `flex-col`이면 세로 방향입니다.

| 클래스 | CSS | 설명 |
|---|---|---|
| `justify-start` | `justify-content: flex-start` | 시작점 정렬 |
| **`justify-center`** | `justify-content: center` | **중앙 정렬 (자주 사용)** |
| `justify-end` | `justify-content: flex-end` | 끝점 정렬 |
| **`justify-between`** | `justify-content: space-between` | **양끝 정렬 (자주 사용)** |
| `justify-around` | `justify-content: space-around` | 균등 배치 (양쪽 여백 절반) |
| `justify-evenly` | `justify-content: space-evenly` | 완전 균등 배치 |

```html
<!-- justify-center -->
<div class="flex justify-center gap-2">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>

<!-- justify-between -->
<div class="flex justify-between">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>
```

![justify-content 시각적 예시](/assets/images/flex/justify-content.png)

---

### flex-col

| | justify (주축) | items (교차축) |
|---|---|---|
| `flex-row` | 가로 ↔ | 세로 ↕ |
| `flex-col` | 세로 ↕ | 가로 ↔ |

> `flex-col`이면 `justify-between`은 좌우가 아닌 **상하 양끝 배치**가 됩니다.

## 3. 교차축 정렬 (align-items)

교차축(cross axis) 정렬. 주축과 수직인 방향입니다.

| 클래스 | CSS | 설명 |
|---|---|---|
| `items-start` | `align-items: flex-start` | 위 정렬 |
| **`items-center`** | `align-items: center` | **중앙 정렬 (자주 사용)** |
| `items-end` | `align-items: flex-end` | 아래 정렬 |
| `items-stretch` | `align-items: stretch` | 늘리기 (기본값) |
| `items-baseline` | `align-items: baseline` | 텍스트 기준선 정렬 |

```html
<!-- items-center -->
<div class="flex items-center gap-2">
  <div class="py-1">A</div>
  <div class="py-4">B (tall)</div>
  <div class="py-2">C</div>
</div>

<!-- items-stretch (기본값) -->
<div class="flex items-stretch gap-2">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>
```

![align-items 시각적 예시](/assets/images/flex/align-items.png)

## 4. 아이템 크기 제어

Flex 아이템의 크기는 세 가지 속성으로 결정됩니다.

- **`flex-grow`** — 남은 공간을 얼마나 차지할지 (비율)
- **`flex-shrink`** — 공간이 부족할 때 얼마나 줄어들지 (비율)
- **`flex-basis`** — 늘어나거나 줄어들기 전 기본 크기

> **기본값: `flex: 0 1 auto`**
>
> 아무 클래스도 안 주면 grow `0` (안 늘어남), shrink `1` (줄어듦), basis `auto` (콘텐츠 크기)입니다.
> Tailwind에서는 `flex-initial`이 이 기본값에 해당합니다.

| 클래스 | CSS | 설명 |
|---|---|---|
| `flex-initial` | `flex: 0 1 auto` | 기본값 (안 늘어남, 줄어듦) |
| **`flex-1`** | `flex: 1 1 0%` | **남은 공간 모두 차지** (필수) |
| `flex-auto` | `flex: 1 1 auto` | 콘텐츠 기반 + 늘어남 |
| `flex-none` | `flex: none` | 크기 고정 (안 늘어남, 안 줄어듦) |
| **`flex-shrink-0`** | `flex-shrink: 0` | **줄어들지 않음** (자주 씀) |
| `flex-grow` | `flex-grow: 1` | 늘어남 |
| `flex-grow-0` | `flex-grow: 0` | 안 늘어남 |

```html
<!-- flex-1: 남은 공간 모두 차지 -->
<div class="flex gap-2">
  <div class="flex-none">고정</div>
  <div class="flex-1">flex-1 (나머지 전부)</div>
  <div class="flex-none">고정</div>
</div>

<!-- flex-shrink-0: 아이콘 찌그러짐 방지 -->
<div class="flex gap-2">
  <img class="flex-shrink-0 w-6 h-6" src="icon.svg" />
  <span>긴 텍스트가 있어도 아이콘은 안 줄어듦</span>
</div>
```

![아이템 크기 제어 시각적 예시](/assets/images/flex/item-size.png)

> **flex-1 vs flex-auto 차이**
> - `flex-1`: basis가 `0` → 모든 아이템 **동일한 크기**로 분배
> - `flex-auto`: basis가 `auto` → **콘텐츠 크기에 비례**해서 분배
> - 대부분 `flex-1`이면 충분합니다

## 5. 줄바꿈 & 간격

| 클래스 | CSS | 설명 |
|---|---|---|
| `flex-wrap` | `flex-wrap: wrap` | 넘치면 다음 줄로 |
| `flex-nowrap` | `flex-wrap: nowrap` | 한 줄 유지 (기본값) |
| **`gap-{n}`** | `gap: {n*4}px` | **모든 방향 간격** (필수) |
| `gap-x-{n}` | `column-gap: {n*4}px` | 가로 간격만 |
| `gap-y-{n}` | `row-gap: {n*4}px` | 세로 간격만 |

```html
<!-- flex-wrap + gap -->
<div class="flex flex-wrap gap-2">
  <span>Tag 1</span>
  <span>Tag 2</span>
  <span>Tag 3</span>
  <span>Tag 4</span>
</div>
```

## 6. 개별 아이템 정렬 (self)

컨테이너의 `items-*`를 무시하고 특정 아이템만 따로 정렬할 때.

| 클래스 | CSS | 설명 |
|---|---|---|
| `self-start` | `align-self: flex-start` | 이 아이템만 위 정렬 |
| `self-center` | `align-self: center` | 이 아이템만 중앙 |
| `self-end` | `align-self: flex-end` | 이 아이템만 아래 |
| `self-stretch` | `align-self: stretch` | 이 아이템만 늘리기 |

```html
<div class="flex items-start gap-3 h-32">
  <div class="self-start">self-start</div>
  <div class="self-center">self-center</div>
  <div class="self-end">self-end</div>
</div>
```

![align-self 시각적 예시](/assets/images/flex/align-self.png)

## 7. 자주 사용하는 패턴

### 1) 완전 중앙 정렬

모달, 로딩 스피너, 빈 상태 등

```tsx
<div className="flex items-center justify-center">
  <Spinner />
</div>
```

### 2) 양끝 배치

헤더, 리스트 아이템, 가격 정보 등

```tsx
<div className="flex items-center justify-between">
  <span>결제 금액</span>
  <span>150,000원</span>
</div>
```

### 3) 아이콘 + 텍스트

알림, 상태 메시지 등. `flex-shrink-0`으로 아이콘 찌그러짐 방지.

```tsx
<div className="flex items-center gap-2">
  <IconCheck className="flex-shrink-0" />
  <span>예약이 완료되었습니다</span>
</div>
```

### 4) 세로 레이아웃

페이지 구조, 카드 내부 등

```tsx
<div className="flex flex-col gap-4">
  <Header />
  <Content />
  <Footer />
</div>
```

### 5) 사이드바 + 콘텐츠

고정 너비 사이드바 + 나머지 공간 채우기

```tsx
<div className="flex">
  <aside className="w-64 flex-shrink-0">사이드바</aside>
  <main className="flex-1">콘텐츠</main>
</div>
```

![실전 조합 패턴 TOP 5](/assets/images/flex/patterns.png)
