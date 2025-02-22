---
slug: sometimes-no-hydration
title: 때때로는 Hydration이 필요하지 않을 수도 있다.
authors: m1nsuppp
tags: [Next.js, hydration, lazy loading, dynamic API]
---

Next.js에서 Hydration을 피하는 법

<!--truncate-->

`<canvas>`에 그릴 데이터를 서버에서 받아오는 동작을 테스트 하고자 컴포넌트를 `<Suspense>`로 감싸주었다.

그런데 `<canvas>`를 렌더링하는 하는 과정에서 갑자기 CLS가 발생했다.

![hydration](hydration.gif)

보기에 영 좋지 않다.

## 클라이언트 컴포넌트 Hydration에 의한 CLS

"왜 이러지?" 2~3분 정도 고민해보니 **클라이언트 컴포넌트 Hydration** 때문이겠다 생각이 들었다.

위 현상을 발생시킨 코드는 대충 이런 구조였다.

```tsx
export default function Page() {
  return (
    <Layout>
      <Suspense fallback={<Skeleton />}>
        <SomethingCanvas />
      </Suspense>
    </Layout>
  );
}
```

그리고 `<SomethingCanvas>`는 클라이언트 컴포넌트다.

```tsx
"use client";

export function SomethingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // ...

  return <canvas ref={canvasRef} />;
}
```

여기서 Hydration에 의한 CLS 발생 원인은 `<SomethingCanvas>` 내부에서 `<canvas>`의 종횡비를 1:1로 맞추기 위한 JS 코드가 작성되어 있기 때문이었다.

그러다보니 서버는 HTML/CSS 내용대로 사용자에게 서빙을 하다보니 사용자는 hydration 전까지 1:1이 아닌 모습을 보게 되는 것이다.

- 그리고 이게 CLS로 이어진다.

대략 플로우는 이럴 것이다.

```text
1. (사용자 -> 서버) HTML 요청
2. (서버 -> 사용자) HTML 응답
 - JS가 실행되기 전의 정적 HTML 콘텐츠
3. (사용자) HTML 파싱 및 렌더링
 - 브라우저가 서버로부터 응답 받은 HTML을 파싱하고 DOM 트리 구성
 - 사용자는 interaction이 불가능한 정적 HTML 콘텐츠 확인 가능(종횡비가 안맞는 <canvas>)
4. (사용자) JS 번들 다운로드
5. (사용자) JS 번들 실행(Hydration 시작)
6. (사용자) Hydration 완료(갑자기 1:1로 변하면서 CLS 현상 발생)
```

그럼 이 CLS 현상을 어떻게 피할 수 있을까?

## 지연 로딩으로 CLS 피하기

Next.js가 제공하는 API인 `dynamic` 을 이용한다.

```tsx
import dynamic from "next/dynamic";

const SomethingCanvas = dynamic(() => import("./SomethingCanvas"), {
  ssr: false,
  loading: <Skeleton />,
});

export default function Page() {
  return (
    <Layout>
      <SomethingCanvas />
    </Layout>
  );
}
```

이렇게 클라이언트 컴포넌트를 지연 로딩함으로써 `ssr: false` 옵션을 통해 서버에서는 렌더링하지 않고, 클라이언트에서만 로드하기 때문에 Hydration 단계를 건너뛰게 된다.

그리고 아래처럼 CLS를 방지할 수 있다.

![no-hydration](no-hydration.gif)

- 내가 보기엔 이 UX가 낫다.

## 맺으며

Hydration은 더 나은 UX를 제공하기 위한 솔루션임은 분명하다. 하지만 모든 문제의 솔루션임은 아닌 것을 알게 됐다.

그리고 평소 RSC, SSR, Hydration에 대해 충분히 학습해뒀던 게 빠른 문제 해결에 도움이 됐다.

- 이를 통해 애자일한 엔지니어가 되기 위해서는 앞으로도 꾸준히 학습하고 응용해야함을 느꼈다.
