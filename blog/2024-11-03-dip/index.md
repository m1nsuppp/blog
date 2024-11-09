---
slug: dip
title: DIP 준수로 변화에 유연하게 대응하기
authors: m1nsuplee
tags: [solid, dip]
---

DIP 원칙을 통해 요구사항 변화에 유연하게 대응한 경험, feat: TanStack Query

<!--truncate-->

:::note

실제 경험은 TanStack Query를 이용하지만, 이 글에서는 각색하여 다룬다.
:::

## 배경

최근 UI는 유지한 채, 페이지네이션 API를 교체해야할 일이 있었다.

이전 API는 데이터를 생성일순으로 정렬하여 페이지네이션 했었지만, 교체할 API는 개인화 추천 시스템이 적용된 데이터를 제공하였다. 이로 인해 두 API의 스펙이 상이했다.

그래서 FE에서는 관련 로직을 변경해야 했지만, UI는 그대로 유지해야했다.

이런 문제 속에서 DIP 원칙을 적용하여 어떻게 변화에 대응 했는지에 대한 경험을 이야기한다.

## 변경 이전의 컴포넌트

```typescript
export function SomethingComponent() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFetchSomethings();

  return (
    <InfiniteScroll
      onEndReached={fetchNextPage}
      ...
    >
      <Layout>
        {data.pages.map((page) => {
          return page.somethings.map((something) => {
            return <SomethingCard key={something.id} {...something} />;
          });
        })}
      </Layout>
    </InfiniteScroll>
  );
}
```

이 컴포넌트는 데이터를 무한 스크롤 방식으로 불러오는 컴포넌트이다. 그리고 이 컴포넌트는 `useFetchSomethings`라는 커스텀 훅에 직접 의존하고 있다.

## 컴포넌트에게 추상화 제공하기

그리고 이제 나는 위에서 언급한 것처럼 사용자에게 개인화된 데이터를 제공하기 위해 `useFetchSomethings`를 `useFetchPersonalizedSomethings`로 교체해야 했다.

두 hook의 내부 구현은 완전히 다를 것이다.

여기서 주목할 점은 `<SomethingComponent>`는 hook의 내부 구현에는 전혀 관심이 없다는 것이다. 컴포넌트는 오직 아래와 같은 인터페이스만 알면 된다.

```typescript
interface FetchSomethings {
  data: Something[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

function useFetchSomethings(): FetchSomethings { ... }
function useFetchPersonalizedSomethings(): FetchSomethings { ... }
```

즉, `<SomethingComponent>`가 `FetchSomethings`라는 추상화에 의존하는 결과를 반환하는 hook에 의존하게 하면, `useFetchSomethings`를 `useFetchPersonalizedSomethings`로 부품 교체 하듯이 교체하면 된다는 것이다.

### 실제 예시: 구현체 전환하기

```typescript
interface FetchSomethings {
  data: Something[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

// 조회순 API 구현
function useFetchSomethings(): FetchSomethings {
  const [data, setData] = useState<Something[]>([]);
  ...

  const fetchNextPage = () => {
    somethingService.fetchSomethings(page).then((data) => {
      ...
    });

    ...
  }

  const hasNextPage = page < totalPages;

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }
}

// 개인화된 API 구현
function useFetchPersonalizedSomethings(): FetchSomethings {
  const [data, setData] = useState<Something[]>([]);
  ...


  const fetchNextPage = () => {
    somethingService.fetchPersonalizedSeeds(nextEndpoint).then((data) => {
      ...
    })

    ...

    const nextEndpoint: string | null = ((
      continuationToken: string | null
    ) => {
      if (continuationToken) {
        return `/api/somethings?continuationToken=${continuationToken}`
      }

      return null
    })(continuationToken);
  }

  const hasNextPage = !!nextEndpoint;

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }
}
```

위 두 구현체는 내부적으로 완전히 다른 방식으로 동작하지만, 동일한 인터페이스를 제공한다. 덕분에 컴포넌트는 어떤 구현체를 사용하든 변경할 필요가 없이, 아래와 같이 직접 의존할 hook만 교체해주면 된다.

```typescript
export function SomethingComponent() {
  // const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useFetchSomethings();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useFetchPersonalizedSomethings();

  return (
    <InfiniteScroll
      onEndReached={fetchNextPage}
      ...
    >
      <Layout>
        {data.pages.map((page) => {
          return page.somethings.map((something) => {
            return <SomethingCard key={something.id} {...something} />;
          });
        })}
      </Layout>
    </InfiniteScroll>
  );
}
```

## 추상화에 의존하는 것이 왜 좋은가?

1. 유연성

- API의 스펙이나 페이지네이션하는 방법이 변경되더라도 컴포넌트 코드는 변경할 필요가 없다. 동일한 인터페이스만 제공하면 된다.

2. 유지보수성

- 구현체 변경이 필요할 때 영향 범위가 최소화된다.

## SOLID 원칙과의 연관성

나의 이러한 경험은 SOLID 원칙 중 두 가지를 잘 보여준다고 생각했다.

1. **의존관계 역전 원칙 (DIP)**

- 구체적인 구현이 아닌 추상화(인터페이스)에 의존한다.

2. **인터페이스 분리 원칙 (ISP)**

- `<SomethingComponent>`는 정확히 필요한 인터페이스만 알고 있다.

## 결론

추상화에 의존하는 것은 단순히 "좋은 프로그래밍 습관" 이상의 의미가 있다고 느낀다.

향후에도 커스텀 훅이나 컴포넌트를 설계할 때, "이 코드가 구체적인 구현에 의존하고 있지는 않은가?"라고 자문하는 습관을 들일 것이다.

하지만, 아직 나는 API 사용자에게 잘못된 추상화를 제공할 가능성이 너무나도 크다고 생각이 든다.

이번에는 좋은 사례로 남았지만, 안좋았던 사례가 더 많은 것 같다.
