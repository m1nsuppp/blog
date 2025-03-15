---
slug: testable-zustand-store
title: 의존성 주입을 활용하여 테스트 가능한 Zustand store 만들기
authors: m1nsuppp
---

React Context API를 의존성 주입 도구로 활용하여 Mocking 없이 Zustand store 테스트하기

<!--truncate-->

## 들어가며

나는 전역 상태를 선호하지 않는다. 그 이유는 아래와 같다.

- 컴포넌트 간의 의존성을 이해하고 관리하기 어렵다.
- 어디서 어떤 변경이 일어났는지 추적하기가 어렵다.
- 상태 변경이 여러 곳에서 일어날 수 있어서 상태를 예측하기 어렵다.

그럼에도 불구하고 이미지 에디터를 개발하게 되면서, 전역 상태 관리 라이브러리를 사용할 수 밖에 없었다. 그 주요한 이유는 아래와 같다.

- UI와 Canvas가 서로 영향을 미쳐야한다.
- 성능 최적화를 꿰해야 한다.

내 선호도와 관계없이, 전역 상태 관리 라이브러리가 가져다주는 이점이 크다고 생각했기 때문이다.

그리고 별 다른 문제없이 제품을 시장에 출시했고, 서비스 운영을 이어나갔다.

하지만 시간이 지남에 따라 코드베이스는 커져갔고, 이에 따라 엔지니어링적인 문제들이 수반되었다.

## 빠른 개발과 품질의 딜레마

제품의 개발기, 도입기를 거쳐 성장기에 진입하며 우리 팀은 좀 더 빠르게 움직일 수 있길 원했다.

개발자인 나는 더 짧은 주기로 배포 주기를 가져가야 했지만, 제약이 되는 걸림돌이 있었다.

### 1. 수동 테스트에 의존적인 요구사항 검증

이미지 에디터 특성상 Canvas와 UI간 상호작용이 매우 복잡했다. 예를 들어 단축키로 UNDO/REDO를 수행한다고 해보면,

- Canvas 내 이미지가 이전/이후 상태로 변경되어야 한다.
- UI의 모든 컨트롤(회전 각도, 밝기, 대비 등)이 해당 시점의 값으로 업데이트 되어야 한다.
- 여러 개의 이미지를 편집 중일 때에는 현재 선택된 이미지의 히스토리만 영향을 받아야 한다.

이런 복잡한 상호작용은 수동 테스트로 검증하기에는 너무 많은 시간이 필요했고, 놓치기 쉬운 엣지 케이스도 많았다. 특히나 우리 팀은 별도의 QA 인력이 없기에 품질 검증이 더욱 힘들었다.

### 2. 잦은 Hotfix

예상치 못한 버그가 프로덕션에서 발생하는 일이 잦았다. 이는 hotfix의 빈도를 증가시켰고, 계획된 작업 일정과 리소스 관리에 영향을 미치게 됐다.

---

배포 주기에 영향을 주는 문제들을 해결해야겠다고 생각이 들었고, 버그 케이스를 커버할 수 있는 테스트라도 작성해야겠다고 생각했다.

## 테스트가 불가능한(의미없는) 코드

버그 케이스를 커버하는 테스트 작성. 의의는 좋다.

문제는 Zustand에 의존적인 모듈들을 테스트하기 상당히 어려웠다. [공식 문서](https://zustand.docs.pmnd.rs/guides/testing)는 zustand를 mocking하고 테스트 사이에 store를 reset하는 등에 관한 내용이 전부였다.

그리고 Zustand store가 전역 싱글톤으로 존재하기에 테스트마다 독립적인 환경을 만들기가 어려웠다.

- 의존성 체이닝을 따라가며 문제를 해결하려고 하니, 테스트 환경 세팅만 한 세월이었다.

테스트 작성 속도를 높이고 복잡한 의존성 작성을 피하고자 Mocking을 자주하게 되다보니 테스트 코드 작성의 의의가 흐려지게 됐다.

그래서 이 문제를 해결하기 위해 어떤 방법을 이용했는지 소개해보겠다.

## 의존성 주입 활용하기

말보다는 코드로 예를 들어보겠다. 에디터에서 사용될 이미지 상태가 있다고 해보자.

```ts
interface ImageLayer {
  // ...
  path: string;
  width: number;
  height: number;
  // ...
  position: {
    x: number;
    y: number;
  };
  effect: {
    // ...
    brightness: number;
    contrast: number;
    // ...
  };
}
```

이제 실제로 사용하는 쪽에서 의존성을 주입할 수 있는 구조를 만들어가보겠다.

### 1. Store 추상화

먼저 Store에서 관리할 상태, 액션들에 대해 추상화했다.

```ts
interface MyStore {
  imageLayers: ImageLayer[];
  actions: MyStoreActions;
}
```

### 2. Store 구현

실제 Store를 생성하는 구현체를 만든다.

```ts
import { createStore, type StoreApi } from "zustand";

type MyStoreState = Omit<MyStore, "actions">;

const defaultState: MyStoreState = {
  imageLayers: [],
  // ...
};

export function createMyStore(
  initialState: MyStoreState = defaultState
): StoreApi<MyStore> {
  return createStore<MyStoreState>((set) => ({
    ...initialState,
    actions: {
      //...
    },
  }));
}
```

여기서 중요한 포인트는 Zustand의 `create` API가 아닌 `createStore` API를 사용했다는 것이다.

- 그 이유는 [여기](#왜-createstore-api일까)에서 설명하겠다.

[createStore API](https://zustand.docs.pmnd.rs/apis/create-store)는 더 낮은 수준의 API로 React에 의존하지 않으며, store 인스턴스를 직접 생성하고 관리할 때 사용된다.

### 3.적용

React의 Context API를 의존성 주입 도구로 활용하여 실제 store를 주입해보자.

```tsx
// my-store-context.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";

export const MyStoreContext = createContext<StoreApi<MyStore> | undefined>(
  undefined
);
MyStoreContext.displayName = "MyStoreContext";

interface MyStoreProviderProps {
  initialState?: MyStoreState;
  children: ReactNode;
}

export function MyStoreProvider({
  children,
  initialState,
}: MyStoreProviderProps): JSX.Element {
  // 주입 받은 값으로 store 생성
  const [store] = useState<StoreApi<MyStore>>(() => {
    return createMyStore(initialState);
  });

  return (
    <MyStoreContext.Provider value={store}>{children}</MyStoreContext.Provider>
  );
}
```

이렇게 Zustand store를 사용하는 쪽에서 의존성을 주입할 수 있는 구조로 설계가 되었다.

그리고 이제 우리는 Zustand store의 상태를 Context에서 가져오고, 업데이트 하면 된다. 일반적인 Zustand Store를 사용하는 것과 다를 것이 없다.

```ts
function useMyStore<S>(selector: (state: MyStoreState) => S): S {
  const store = useContext(MyStoreContext);

  if (!store) {
    throw new Error();
  }

  return useStore(store, selector);
}
```

그리고 이제 실제 사용해보자. 서버에서 받아온 데이터를 store에 초기화하는 예를 들어보겠다.

```tsx
function App() {
  // 서버 데이터
  const remoteData = useFetchRemoteData();

  return (
    <MyStoreProvider initialState={remoteData}>
      <UI />
      <Canvas />
    </MyStoreProvider>
  );
}
```

서버 데이터를 Zustand store에 초기화 시도를 해본 개발자들이라면 어떤 점이 나아졌는지 눈에 보일 것이다(하지만 그 부분에 대한 설명은 생략한다).

### 4. 테스트 코드 작성하기

```tsx
it("UI에서 비율을 변경하면 캔버스의 크기가 변경된다.", () => {
  const user = userEvent.setup();

  render(
    <MyStoreProvider
      initialState={{
        ratio: {
          width: 1,
          height: 1,
        },
      }}
    >
      <RatioMenu />
      <Canvas />
    </MyStoreProvider>
  );

  await user.click(await screen.findByRole("button", { name: "16:9" }));

  const canvas = container.querySelector("canvas");

  expect(canvas).toHaveStyle({
    width: "100%",
    height: "56.25%",
  });
});
```

이런 식으로 기대하는 동작만 검증할 수 있게 됐다.

## 맺으며

제품의 품질을 개선하기 위한 고민에서 시작한 테스트 코드 도입기는 많은 교훈, 생각을 안겨주었다.

- 테스트 코드는 최고의 요구사항 문서다. 특히 구독 결제 비즈니스 특성상 이 규칙이 굉장히 복잡한데, 결제 테스트 코드가 항상 최신의 상태를 보장하는 비즈니스 요구사항 문서의 역할을 하고있다.
- "처음부터 테스트 가능한 구조로 설계를 했더라면 어땠을까?" 생각하기도 했다. ~~물론 그 때는 아무 것도 몰랐다~~
- "적정 엔지니어링에 대한 훈련은 어떻게 할 수 있을까?" 생각했다. ~~개발자 커리어가 끝나는 순간에도 모르지 않을까~~

---

#### 왜 createStore API일까?

`create` API는 전역 싱글톤 스토어를 생성한다.

그런데 우리가 만약 여러개의 `MyStore`가 필요하다고 가정해보자.

의존성(props) 주입 시, 내 생각에는 두 가지 선택지가 있을 것 같다.

1. props가 변경될 때마다 store를 새로 생성한다
2. props가 변경되어도 store는 유지하고, 필요한 부분만 업데이트한다

그런데 `create` API를 사용하면 전역 싱글톤이기 때문에 1번 방식을 사용할 수 없다.

- store가 한 번 생성되면 그 상태를 계속 유지해야 하기 때문이다.

```ts
// create API 사용 시
const useStore = create<Store>((set) => ({
  // ❌ props가 바뀌어도 store는 이미 생성되어 있어서 영향 없음
  value: props.initialValue,
  // ...
}));
```

반면 `createStore` API를 사용하면 의존성(props) 변경에 따라 store를 자유롭게 초기화할 수 있다.

```tsx
const store = useState(() => {
  return createStore({ ... });
});

return <Context.Provider value={store}>...</Context.Provider>
```
