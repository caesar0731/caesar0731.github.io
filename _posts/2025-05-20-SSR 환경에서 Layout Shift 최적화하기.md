# SSR 환경에서 Layout Shift 최적화하기: Next.js App Router

**React Query + Jotai 활용한 초기 렌더링 성능 개선**

Next.js와 같은 SSR 환경에서는 첫 화면이 빠르게 그려지더라도, 클라이언트 단에서 데이터를 다시 패칭하는 사이에 레이아웃 이동(Layout Shift) 이 발생해 사용자 경험을 해칠 수 있습니다. 특히 리스트의 길이처럼 화면의 높이가 바뀌는 요소들은 CLS(Cumulative Layout Shift) 점수에 큰 영향을 줍니다.

이번 글에서는 리스트를 가진 페이지의 SSR 환경에서 React Query와 Jotai를 함께 활용하여 초기 렌더링 속도를 개선하고 Layout Shift를 줄인 과정을 정리했습니다.

## 문제 1: 초기 진입 시 깜빡이는 화면

- SSR 환경임에도 불구하고, 클라이언트가 JS를 실행하기 전까지는 데이터가 비어있어 로딩 스켈레톤만 보임

- 데이터가 패치되면서 리스트가 나타나고, 리스트 길이에 따라 화면이 갑자기 줄어드는 Layout Shift 발생

// 특히 페이지네이션이 적용된 화면에서, 다른 페이지로 새로고침 시 1페이지 → 2페이지로 전환되는 깜빡임 현상 발생

## 해결 1: React Query Dehydration 적용

React Query의 **prefetchQuery** + **Hydrate** 기능을 이용해 서버에서 데이터를 먼저 패치하고,

HTML에 포함시켜 클라이언트에서는 바로 사용할 수 있도록 했습니다.

```tsx
await queryClient.prefetchQuery({
  queryKey: [queryKey],
  queryFn: () =>
    api.getData({ parameters }, {
      headers: { Cookie: serverCookies },
    }),
});

const dehydratedState = dehydrate(queryClient);

return (
  <Hydrate state={dehydratedState}>
    <ClientComponent />
  </Hydrate>
);
```

### 효과

- HTML 응답 시 데이터가 포함되어 초기 화면에 바로 렌더링되어 로딩 스켈레톤 대신 실제 콘텐츠가 즉시 보임

- React Query의 캐시를 활용해 클라이언트에서도 동일한 데이터를 재사용 가능

## 문제 2: 2페이지에서 새로고침하면 또다시 깜빡임

초기 페이지 진입시 로딩없이 빠르게 화면이 보이고 페이지네이션 이동시에는 스켈레톤이 노출되어 의도했던대로 동작했는데

실수로 새로고침을 했을때 데이터가 바로 보이지 않고 깜빡이는 현상을 발견했습니다.

- url에 있는 page query를 파라미터로 사용하고 있고 클라이언트에서는 이를 atom으로 관리

- 초기 진입을 2페이지로 할때 정상적으로 prefetch + hydrate가 진행된다음 클라이언트에서 스토어에 기본값으로 선언된 page=1을 보고 1페이지를 호출

## 해결 2: Jotai useHydrateAtoms 적용

Jotai의 **useHydrateAtoms**를 사용해 서버사이드에서 사용한 page query를 atom의 초기값으로 설정해주었습니다.

```ts
useHydrateAtoms([
  [pageAtom, initialFromServer],
]);
```
## 문제 3: 3페이지에서 새로고침하면 또또다시 깜빡임

2페이지로 초기진입시에도 의도한대로 동작하고 이제는 정말로 모든 문제가 해결된줄 알고 다음페이지로 넘어가고 새로고침도 시도해봤는데

3페이지에서 새로고침하면 또다시 깜빡이는 문제를 발견했습니다.

기존에 프로젝트 설계를 React Query로 서버상태를 관리하고 Jotai는 작고 단순한 상태만 관리하여 Provider를 전역에서 하나만 관리하기로 구분하였습니다.

이로인해

- useHydrateAtoms는 초기화되어있지 않은 상태에서만 수화를 진행하도록 설계됨

- 전역스토어 관점에서는 2페이지에서 수화되어 데이터를 가지고 있는 더이상 초기화가 불필요한 atom

## 해결 3: List 페이지 단위로 Provider 분리

Provider Scope 단위로 상태값들이 구분되어있어 2페이지에서 수화된 값이 3페이지에서도 남아있어서 

prefetch는 2페이지로 진행하고 queryKey가 달라 클라이언트 상태에서 3페이지로 한번 더 fetch를 진행하고 있습니다.

이를 방지하기위해 페이지 단위의 Provider로 Scope를 지정하여 page atom을 분리할수 있었습니다.

**다행스럽게도 문제2의 useHydrateAtoms과는 다른 이슈여서 4페이지, 5페이지... 매 페이지마다 수정할 필요는 없었습니다.**

### 효과

- list 경로 진입 시마다 상태가 URL 기준으로 새로 초기화

- 다른 페이지로 이동해도 이전 상태가 유지되지 않음

## 결과: CLS 개선 + 인터랙션 속도 향상

- CLS 점수: 0.26 → 0.08로 대폭 개선

- 로딩 스켈레톤 대신 실제 데이터를 바로 보여줘 빠른 사용자 인터랙션 제공

- 레이아웃 이동 없이 실제 콘텐츠가 곧바로 화면에 노출

그동안 Next.js를 사용해왔지만, 서버사이드 렌더링의 이점을 충분히 활용하지 못하고 있었습닏.

이번 개선을 통해 서버에서 데이터를 prefetch하고 클라이언트에서는 atom을 hydrate하는 흐름을 유기적으로 구성할 수 있었고,

enabled, keepPreviousData 옵션과 연계하여 한 번만 호출되면 되는 데이터(예: 전체 리스트 개수 등)를

서버사이드 데이터와 연동하여 관리할 수 있었습니다.
