---
title: "Playwright 브라우저 자동화 정리"
tags: [Playwright, 자동화, 테스트]
lastmod: 2026-03-28 08:00:00
sitemap:
    changefreq: daily
    priority: 0.5
comments: true
published: true
---

브라우저로 화면을 제어하기 위해

Playwright를 처음 써보면서 정리한 내용입니다.

## 1. Playwright란

Playwright는 Microsoft에서 만든 브라우저 자동화 라이브러리입니다.

Chromium, Firefox, WebKit 세 가지 브라우저 엔진을 모두 지원하고

E2E 테스트뿐 아니라 웹 스크래핑, 자동화 스크립트 용도로도 많이 쓰입니다.

### 다른 라이브러리와 비교

| | Playwright | Puppeteer | Selenium | Cypress |
|---|---|---|---|---|
| 브라우저 지원 | Chromium, Firefox, WebKit | Chromium 위주 | 대부분 브라우저 | Chromium, Firefox, Edge |
| 언어 | JS/TS, Python, Java, C# | JS/TS | 다양 | JS/TS |
| Auto Wait | O | X (직접 구현) | X | O |
| 러닝커브 | 낮음 | 낮음 | 높음 | 중간 |
| 용도 | 테스트 + 자동화 | 자동화 위주 | 테스트 위주 | 테스트 전용 |

Puppeteer는 Chromium 위주라 다른 브라우저에서 돌려야 할 때 대응이 어렵고

Selenium은 러닝커브가 높고 Cypress는 테스트 전용 성격이 강해서

자동화 스크립트 목적으로는 Playwright가 가장 적합했습니다.

특히 **Auto Wait** 기능이 큰 장점인데

요소가 나타날 때까지 알아서 기다려주기 때문에 sleep을 넣어가며 타이밍을 맞출 필요가 없습니다.

## 2. 설치 및 시작

```sh
mkdir my-project
cd my-project
npm init -y
npm install playwright
```

설치하면 Chromium, Firefox, WebKit 브라우저 바이너리도 같이 받아줍니다.

### 브라우저 열기

```js
const { chromium } = require('playwright');

const browser = await chromium.launch({
    headless: true, // true면 화면 없이 실행, false면 브라우저 창이 열림
});

const page = await browser.newPage();
```

`headless: false`로 바꾸면 실제 브라우저 창이 열려서 디버깅할 때 유용합니다.

chromium 대신 `firefox`나 `webkit`을 import하면 해당 브라우저로 실행할 수 있습니다.

## 3. 페이지 이동

```js
await page.goto('https://example.com', {
    waitUntil: 'networkidle',
    timeout: 30000,
});
```

### waitUntil 옵션

| 옵션 | 설명 |
|---|---|
| `load` | load 이벤트 발생 시 (기본값) |
| `domcontentloaded` | DOMContentLoaded 이벤트 발생 시 |
| `networkidle` | 네트워크 요청이 500ms 이상 없을 때 |
| `commit` | 응답을 받기 시작할 때 |

SPA처럼 JS로 콘텐츠를 불러오는 페이지는 `networkidle`이 안정적입니다.

`timeout`은 밀리초 단위이고 시간 내에 조건을 만족하지 못하면 에러가 발생합니다.

## 4. 요소 선택 (Locator)

Playwright에서는 `querySelector` 대신 **Locator**를 사용합니다.

Locator는 요소를 찾는 것과 동시에 Auto Wait까지 해주는 핵심 개념입니다.

### 기본 사용법

```js
// CSS 셀렉터로 요소 찾기
const button = page.locator('button.submit');

// 텍스트 내용으로 필터링
const movieButton = page
    .locator('button:has(span.title)')
    .filter({ hasText: '텍스트' });
```

### 주요 Locator 메서드

```js
// 역할(role) 기반 선택 - 접근성 속성 활용
page.getByRole('button', { name: '확인' });

// 텍스트 기반 선택
page.getByText('로그인');

// placeholder 기반
page.getByPlaceholder('이메일을 입력하세요');

// test id 기반 (data-testid 속성)
page.getByTestId('submit-button');
```

`getByRole`, `getByText` 같은 메서드가 CSS 셀렉터보다 권장되는 방식인데

마크업이 바뀌어도 깨지지 않아서 테스트에서 특히 유용합니다.

자동화 스크립트에서는 CSS 셀렉터 + filter 조합도 충분히 잘 동작합니다.

## 5. 대기 (Wait)

Playwright의 가장 큰 장점 중 하나가 **Auto Wait**입니다.

`click()`, `fill()`, `check()` 같은 액션을 실행하면

해당 요소가 나타나고, 보이고, 안정될 때까지 자동으로 기다려줍니다.

### 명시적 대기가 필요한 경우

Auto Wait가 커버하지 못하는 상황에서는 직접 대기를 걸어야 합니다.

```js
// 특정 요소가 화면에 보일 때까지 대기
await movieButton.waitFor({
    state: 'visible',
    timeout: 30000,
});
```

### waitFor의 state 옵션

| state | 설명 |
|---|---|
| `visible` | 요소가 DOM에 있고 화면에 보일 때 |
| `hidden` | 요소가 숨겨지거나 DOM에서 사라질 때 |
| `attached` | 요소가 DOM에 추가될 때 |
| `detached` | 요소가 DOM에서 제거될 때 |

### 로딩 스피너 기다리기

페이지 전환 시 로딩 스피너가 있으면 그게 사라질 때까지 기다려야 합니다.

```js
// 로딩 스피너가 사라질 때까지 대기
await page.waitForSelector('span.loading-spinner', {
    state: 'hidden',
    timeout: 15000,
});
```

이게 은근히 중요한데 로딩 중에 다음 코드가 실행되면

분명 코드는 맞는데 동작을 안 하는 것처럼 보이는 상황이 생깁니다.

### 그 외 대기 메서드

```js
// URL이 바뀔 때까지 대기
await page.waitForURL('**/checkout');

// 네트워크 응답 대기
await page.waitForResponse(resp =>
    resp.url().includes('/api/data') && resp.status() === 200
);

// 특정 조건이 만족될 때까지 대기
await page.waitForFunction(() => document.title.includes('완료'));
```

## 6. 요소 상태 확인 및 액션

### 상태 확인

```js
const button = page.locator('button.date');

// 화면에 보이는지
const isVisible = await button.isVisible();

// 활성화 상태인지 (disabled가 아닌지)
const isEnabled = await button.isEnabled();

// 체크박스가 체크되어 있는지
const isChecked = await checkbox.isChecked();
```

`isVisible`과 `isEnabled`를 조합하면

화면에는 보이지만 disabled 처리된 요소를 구분할 수 있습니다.

querySelector로 직접 속성을 찾아볼 필요 없이 메서드 하나로 확인이 가능합니다.

### 클릭

```js
// 기본 클릭
await button.click();

// 강제 클릭 - 다른 요소에 가려져 있어도 클릭
await button.click({ force: true });

// 더블클릭
await button.dblclick();
```

`force: true`는 오버레이나 딤드 처리된 요소 위의 버튼을 클릭할 때 유용합니다.

### 입력

```js
// 텍스트 입력
await page.locator('input.search').fill('검색어');

// 키보드 입력
await page.keyboard.press('Enter');
```

## 7. 마무리

Playwright를 사용해 보면서 느낀점은

있겠다 싶은 기능은 찾아보면 다 있다는 것이었습니다.

특히 Auto Wait 덕분에 (반신반의했지만) 

`await page.waitForTimeout(1000);` 같은 코드를 안 넣어도 되는 게 정말 편했고

Locator의 `filter`, `isVisible`, `isEnabled` 같은 메서드들이

직접 DOM을 탐색하는 것보다 훨씬 직관적이었습니다.

헤드리스 브라우저로 자동화 스크립트를 작성할 때

Playwright는 충분히 좋은 선택지라고 생각합니다.
