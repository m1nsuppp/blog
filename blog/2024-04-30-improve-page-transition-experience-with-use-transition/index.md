---
slug: improve-page-transition-experience-with-use-transition
title: useTransition으로 페이지 이동 경험 개선하기
authors: m1nsuplee
tags: [react, next.js]
---

Next.js App Router로 제품을 개발하며 고민거리였던 것은 페이지 이동이 느려 링크 클릭이 무반응처럼 보일 때가 있다는 것이었어요.
당연히 JS 크기를 줄이는 것이 Best practice겠지만, 이는 상황을 고려했을 때 쉽지 않은 방법이었어요.

그래서 어떻게 사용자에게 **_"페이지 이동 중"_**이라는 것을 알려줄지 고민하던 중, `useTransition`으로 이를 해결한 방법을 공유합니다.

<!--truncate-->

:::note

`useTransition`이 무엇인지에 대해서는 다루지 않습니다. `useTransition`에 대한 정보는 [공식문서](https://react.dev/reference/react/useTransition)를 참고해주세요.

:::

## 👿 문제: `router.push()`를 통한 페이지 이동이 느려 무반응처럼 느껴진다.

예를 들면, 아래와 같이 router.push()를 이용한 페이지 이동이 느리게 느껴진다는 것이 문제였어요.

제가 처음에 이런 코드를 작성했을 때, 기대한 결과는 mutation이 일어나는 동안 로딩 UI를 보여주고, mutation이 끝나면 바로 페이지 이동이 일어나는 것이었어요.

```tsx
const router = useRouter();

const { mutate: createProject, isPending: isCreateProjectPending } =
  useCreateProject({
    // response.destination.url: 앱 내 페이지
    onSuccess: (response) => router.push(response.destination.url),
    onError: (error) => toast.error(error.message),
  });

return (
  <button
    type="button"
    disabled={isCreateProjectPending}
    onClick={() => createProject(...)}
  >
    {isCreateProjectPending ? <Loading /> : <span>New project</span>}
  </button>
);
```

하지만 실제 결과는 mutation이 끝나고, `isPending`이 false가 되어 `<Loading>`이 아닌 `<span>New project</span>`가 렌더링 된 상태로 페이지 이동 전까지 유지된다는 것이었어요.

> `createProject()`로 서버에서는 이미 프로젝트 생성을 끝냈지만, 프론트엔드 애플리케이션에서 `response.url`에 해당하는 페이지에 대한 UI를 아직 그리지 못한 상황이라 이런 상황이 생긴다고 생각했어요.

그래서 사용자가 보기에는 순간적으로 "왜 아무런 피드백이 없지?"라고 느끼기에 딱 좋은 상황이었어요.

당연히 JS 번들 크기를 줄이는 것이 Best Practice겠지만, 번들 사이즈를 줄이는 일은 비용이 너무 많이 발생하여 다른 방법을 찾아야했어요.

## 🔥 해결: `router.push`도 React 상태를 업데이트하는 hook이다.

```typescript
const [isPending, startTransition] = useTransition();
```

`useTransition`이 반환하는 배열 중 1번 요소는 보통 `startTransition`이라는 이름을 붙이며, `startTransition()`에 전달된 상태 업데이트는 렌더링시 우선순위가 낮아져요.

그래서 아래와 같이 코드를 수정했어요.

```tsx
const router = useRouter();
const [isRoutePending, startRouteTransition] = useTransition();

const { mutate: createProject, isPending: isCreateProjectPending } =
  useCreateProject({
    // response.destination.url: 앱 내 페이지
    onSuccess: (response) => {
      startTransition(() => {
        router.push(response.destination.url);
      });
    },
    onError: (error) => toast.error(error.message),
  });

return (
  <button
    type="button"
    disabled={isCreateProjectPending || isRoutePending}
    onClick={() => createProject(...)}
  >
    {isCreateProjectPending || isRoutePending ? <Loading /> : <span>New project</span>}
  </button>
);
```

이렇게 코드를 수정함함으로써 `router.push` 내부의 상태 업데이트 우선순위를 낮췄고, 그 덕분에 새 페이지가 백그라운드에서 로드되는 동안 사용자가 `<Loading>`이라는 의미있는 UI를 계속 볼 수 있게 됐어요. 그리고 이렇게 하면, 새 페이지의 UI가 모두 그려지면 UI가 즉시 전환됩니다.

그 결과, 사용자가 "왜 아무런 피드백이 없지?"라고 오해할 수 있는 상황을 해결 했어요.

## 🎬 마무리

재미있었던 점은 실제로 페이지 로딩 속도 성능 개선을 한 것이 아니고, 상태 업데이트의 동작 순서를 조작하여 마치 페이지 이동이 빠르게 이루어지는 것 처럼 보이게 한다는 것이에요.

그런데 이렇게 글을 작성하고나니 useTransition 내부가 어떻게 이루어져있는지 너무 궁금해지는 계기가 됐어요. 나중에 `useTransition` 직접 구현에 도전해보면 좋겠다는 생각이 들었습니다!
