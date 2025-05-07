# SSR 환경에서 Layout Shift 최적화 하기

1. ssr 환경인데 처음 페이지 진입시 데이터가 패치되기 전까지 로딩화면이 보여짐

2. 데이터 패칭이 완료되어 화면이 랜더링될때 리스트들이 줄어드는경우 움직임 발생

## React Query Dehydration 적용

- 서버에서 먼저 html을 내려 빠르게 화면에 그려주고 클라이언트에서 JS로 로직을 동작시켜 그려주는 방식이 하이드레이션

클라이언트에서 JS가 동작해야 데이터 패칭을 할수 있는데

react query에서 지원하는 prefetch를 사용해서 서버컴포넌트에서 데이터를 미리 패칭할수 있게 해줌

패치에 필요한 파라미터와 쿠키는 서버에서 직접 접근해서 쿼리에 주입하는 과정이 필요

그리고 패칭된 데이터는 쿼리키를 바탕으로 캐싱되어 클라이언트 컴포넌트에서 재사용

```js
export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const requestParameters = {
    page: resolvedSearchParams.page,
    searchFilter: resolvedSearchParams.searchFilter,
    size: PAGINATION_VIEW_SIZE,
  };

  const cookieStore = await cookies();
  const sessionKeys = ["SESSION", "currentCountry", "currentLocale"];
  const cookie = sessionKeys
    .map((key) => {
      const cookie = cookieStore.get(key);
      if (cookie) return `${cookie.name}=${cookie.value}`;
      return null;
    })
    .filter((cookie) => cookie !== null)
    .join("; ");

  await queryClient.prefetchQuery({
    queryKey: [BOOKING_QUERY_KEY.GET_USER_BOOKINGS_BY_FILTER, searchFilter, page],
    queryFn: () =>
      getUserBookingApi().getUserBookingsByFilter(
        {
          searchFilter: searchFilter,
          page: page,
          size: PAGINATION_VIEW_SIZE,
        },
        {
          headers: { Cookie: sessionCookies || "" },
          credentials: "include",
        },
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <clientComponent>
    </Hydrate>
  );
}
```

## Jotai useHydrationAtom 추가

이제 페이지 진입시 로딩이나 화면 이동없이 빠르게 랜더링할수 있었는데

2페이지에서 새로고침했을때 화면에 깜빡임이 발생했다.

url에 있는 ?page=2&searchFilter=CANCEL 파라미터들을 클라이언트 상태에서는 atom으로 관리하고 있었는데

2페이지로 진입시 서버상태일때 userBookingsRequestAtom의 기본값인 page=1의 값이 먼저 보이고



## 서버 상태에서 쿠키 삽입

클라이언트에서는 브라우저의 쿠키를 가져다 쓸수 있었는데

prefetch 시점에는 브라우저가 없어서

await cookies를 통해 직접 접근하여 쿼리에 삽입

```js
const cookieStore = await cookies();
const sessionKeys = ["SESSION", "currentCountry", "currentLocale"];
const cookie = sessionKeys
  .map((key) => {
    const cookie = cookieStore.get(key);
    if (cookie) return `${cookie.name}=${cookie.value}`;
    return null;
  })
  .filter((cookie) => cookie !== null)
  .join("; ");
```

```js
{
  headers: { Cookie: sessionCookies || "" },
  credentials: "include",
},
```

## prefetch된 데이터 캐싱



```js

```


기존에는 페이지에 처음 진입하면 간단한 로딩 화면이 보여진뒤 리스트 화면이 그려지고 있었습니다.

next.js 서버사이드 
처음 페이지 진입시 서버에서 html을 받아서 그리고 js
next.js 신규 진입시 html만 완성이 되어있고 fetch, atom 등은 아직 완료되지 않은 상태로 남아있습니다.
이때 cls 개선을 위해 스켈레톤으로 로딩 상태를 보여주고 있었습니다.

추가적으로 좀더 빠른 화면랜더링을 위해 page=1, searchFilter=upcoming의 query로 prefetch를 진행하여 SSR에서 데이터가 패칭된 상태로 html이 내려올수 있도록 dehydrate을 적용하였습니다.
그런데 여기서 page=2, searchFilter=past등 초기 상태가 atom의 기본값과 다른경우 prefetch가 완료되더라도 CSR에서 atom 초기상태로 한번 동작하고 useEffect 훅 등으로 서버상태로 변경되어 데이터가 깜빡이는 상황이 있었습니다.
이에 jotai에서 제공하는 useHydrateAtoms을 사용해 서버에서 받은 상태를 초기값으로 바로 선언하도록 반영하였습니다.

## 1. 깜빡이고 움직이는 화면

Next.js SSR 환경에서 사용자가 처음 화면에 진입시 AppRouter의 RootLayout과 서버컴포넌트들과같은 서버에서 랜더링되는 화면이 브라우저에 빠르게 보여지고

그 이후에 CSR이 진행되면서 데이터가 패칭되고 상태들이 업데이트되어 화면 랜더링이 완성됩니다.

기존에는 화면의 움직임과 유저에게 로딩중인 정보를 전달하기위해 스켈레톤으로 먼저 화면을 그려주고 있었습니다.

## 2. 데이터 패칭을 조금 더 빨리 해보자

더 나은 사용자 경험을 위해 ?page=1&filter=filter와 같은 기본 검색 조건으로 React Query에서 prefetch를 진행하였습니다.



서버에서 데이터를 미리 가져오고 이를 

그러나 보다 빠른 화면을 위해 


1. 문제 제기

Next.js에서 SSR을 통해 SEO 최적화, 빠른 화면 랜더링 등 

2. 우리의 기술스택

3. 하이드레이션이란

4. SSR + Query 하이드레이션 방법

5. 적용 결과

6. 문제점

1. 문제의 배경
Next.js App Router 환경에서 React Query v4와 Jotai를 함께 사용하며 SSR을 적극적으로 활용하고 있었습니다. 페이지 진입 시 사용자에게 최대한 빠르게 렌더링된 화면을 제공하고, **CLS (Cumulative Layout Shift)**를 최소화하는 것이 주요 과제였습니다.

기존에는 SSR이 완료된 HTML이 클라이언트에 도착해도, React Query의 데이터 패칭과 Jotai의 상태 초기화가 완료되기 전까지는 스켈레톤 UI로 로딩 상태를 보여주고 있었습니다.

2. 초기 접근: React Query Prefetch + Dehydrate 적용
보다 나은 사용자 경험을 위해, page=1, searchFilter=upcoming 과 같은 초기 검색 조건을 기준으로 React Query에서 prefetch를 진행했습니다. 서버에서 해당 데이터를 미리 가져온 뒤, dehydrate를 통해 HTML과 함께 내려보냄으로써 클라이언트 측에서 곧바로 데이터를 사용할 수 있도록 했습니다.

이 방식은 첫 화면 로딩 속도를 개선하고, 스켈레톤 상태를 최소화하는 데 효과적이었습니다.

3. 발생한 이슈: Jotai 초기값 불일치로 인한 깜빡임
하지만 곧 Jotai와의 초기값 불일치 문제가 드러났습니다.

React Query는 prefetch된 데이터를 기반으로 작동했지만, Jotai는 클라이언트에서 설정된 기본값을 기준으로 한 번 동작한 후, useEffect 등을 통해 서버 상태로 전환되고 있었습니다.

예를 들어, SSR 시점에서는 page=2, searchFilter=past로 요청이 들어왔음에도 Jotai는 여전히 기본값인 page=1, searchFilter=upcoming으로 렌더링을 진행해 짧은 깜빡임이 발생하는 문제가 있었습니다.

4. 해결책: useHydrateAtoms의 도입
이를 해결하기 위해 Jotai의 useHydrateAtoms 기능을 사용해 서버에서 전달된 상태를 atom 초기값으로 바로 설정해주었습니다.

이 방식은 CSR에서 다시 atom이 잘못된 값으로 동작하는 것을 방지하고, 초기 hydration 시점에 올바른 값을 유지하도록 도와주었습니다. 이를 통해 깜빡임 없이 자연스럽게 서버 상태를 유지한 채 화면이 렌더링될 수 있었습니다.

5. 추가 개선: 전역 Store 공유 이슈와 Provider 도입
하지만 여기서 또 하나의 문제가 발생했습니다.

현재 Jotai store는 글로벌하게 관리되고 있었고, SSR 시 서버 인스턴스 간 공유되고 있었습니다. 이로 인해 useHydrateAtoms가 앱 단위로 한 번만 동작하는 한계에 직면하게 되었습니다.

이를 해결하기 위해, hydration이 필요한 경로마다 Jotai Provider를 개별적으로 선언해 페이지 단위로 hydration이 수행되도록 구조를 변경했습니다.

💡 즉, App 단위의 hydration → Page 단위의 hydration으로 전환

이렇게 구성하니 각 페이지가 독립적으로 SSR + hydration 흐름을 완성할 수 있었고, 글로벌 Store 공유로 인한 부작용도 제거되었습니다.

6. 마무리 및 배운 점
이번 작업을 통해, React Query + Jotai 조합에서 SSR을 적극 활용하는 경우 각 라이브러리의 hydration 동작을 명확히 이해하고 조정하는 것이 중요함을 체감했습니다.

React Query의 dehydrate는 매우 강력하지만, 클라이언트 상태와의 정합성을 신중히 맞춰야 함

Jotai는 기본적으로 클라이언트 중심 상태이기 때문에 useHydrateAtoms를 통해 명시적으로 서버 상태를 주입해주어야 함

SSR 환경에서는 전역 Store 공유를 피하고, 페이지 단위로 컨텍스트를 관리하는 것이 더 안정적임

✅ 결론
이 글을 통해, App Router 기반 Next.js 프로젝트에서 React Query와 Jotai를 함께 사용할 때의 SSR, hydration, 초기 깜빡임 문제 해결 방법을 공유했습니다. 비슷한 환경에서 어려움을 겪고 있는 분들에게 도움이 되길 바랍니다.

