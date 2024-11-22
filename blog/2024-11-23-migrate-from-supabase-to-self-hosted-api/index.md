---
slug: migrate-from-supabase-to-self-hosted-api
title: Supabase에서 자체 API 서버로, IoC와 의존성 제어 활용기
authors: m1nsuplee
tags: [ioc]
---

Supabase에서 자체 API 서버로 전환하는 과정에서 제어의 역전(IoC)과 의존성 제어를 어떻게 활용했는지에 대한 경험

<!--truncate-->

## 배경

처음에는 개발자가 2명뿐이었다. AI 엔지니어와 웹 개발자인 나.

대부분의 스타트업들이 그렇듯이 빠르게 시장에 던져보고, 반응을 살펴야했다. 그렇기 때문에 Supabase는 우리에게 최적의 솔루션이었다.

서비스 초기, 우리 팀은 제품 개발과 신규 기획, 마케팅 등 수많은 일들을 빠른 시간 안에 해내야했다.

하지만 동시에 제품의 엔지니어로서 기술 부채를 쌓지 않기 위해 외부 의존성을 제어할 수 있는 아키텍처에 대한 고민을 놓치지 않고싶었다.

사실 지금이나 그 때나 햇병아리 개발자인 것은 똑같지만, 그 당시에는 책에서 배운 개념들을 실무에 녹여내고 싶어했던 것 같다.

> 1. 외부 의존성에 직접 의존하지 말 것
> 2. 구현이 아닌 추상화에 의존할 것

돌이켜보면, 당장 내일 사라질지도 모르는 제품에 오버 엔지니어링을 한 게 아닐까 싶기도하다.

- 아마 웹 개발자 팀원이 한 명이라도 더 있었다면, 왜 이런 구조를 택했냐고 했을 것 같다.

하지만 마냥 근거 없는 선택은 아니었다. 판단 기준은 아래와 같았다.

- Supabase는 MVP에 쓰일 백엔드이다.
- 추상화로 인한 복잡성 비용 대비 이점이 있는가?
- 구독 결제와 같은 비즈니스 로직이 Supabase만으로는 힘들었다.
  - 내가 백엔드 스킬이 부족해서 그럴 수도 있다.

## 외부 의존성 제어를 위한 고민

개발 속도를 유지하면서도 시스템의 유연성을 확보하는 것은 쉽지 않았다. 나의 접근 방식은 **필요할 때 확장 가능한 최소한의 추상화**였다.

### 문제: HTTPClient 인터페이스와 Supbase SDK의 간극

Supabase SDK는 추상화된 `HTTPClient` 인터페이스와 완전히 호환되지 않았다. 그렇다고 SDK의 메서드들을 `HTTPClient` 인터페이스를 맞추는 것은 멍청한 행동이라고 생각했다.

```typescript
// 이상적인 HTTPClient 인터페이스
interface HTTPClient {
  get<Data = unknown>(url: string, params?: Record<string, any>): Promise<Data>;
  post<Data = unknown>(url: string, body?: unknown): Promise<Data>;
  ...
}

// Supabase SDK를 통한 read
supabase
  .from('table')
  .select('*')
  .order('created_at', { ascending: false });

// Supabase SDK를 통한 create
supabase
  .from('table')
  .insert({ ... })
  .select('*')
  .single();
```

그렇다고 엄청난 생산성의 1등 공신 중 하나인 Supabase SDK를 쓰지 않겠다는 것은... 굳이 말을 이어나가지 않아도 될 것 같다.

### BFF 서버로 두 마리 토끼 잡기

나의 경우, 제품의 코어 기술 스택이 Next.js이었기 때문에 가능한 선택이었다.

- 바쁜 일정 속, 별도의 BFF 서버를 띄워야했다면, Supabase 의존성 제어를 고려하지도 않았을 것이다.

Next.js API Route handler에서는 Supabase SDK를 이용하고, API 클라이언트 쪽에서는 `HTTPClient` 추상화에 의존하게 했다.

```typescript
// /app/api/projects/[projectId]route.ts
export async function GET(
  request: NextRequest,
  { params: { projectId }}: { params: { projectId: string }}
): Promise<NextResponse<FetchProjectResponseBody>> {
  ...

  const {
    data: project,
    error: fetchProjectError,
    status: fetchProjectStatus,
  } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('id', projectId)
    .single();

  ...

  return NextResponse.json({
    code: fetchProjectStatus,
    message: StatusMessages.OK,
    result: project,
  });
}

// /services/project-service.ts
class ProjectService {
  private readonly httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  fetchProject(projectId: string) {
    return this.get<Project>(`/api/projects/${projectId}`);
  }
}
```

하지만, 이대로는 좀 아쉬운 점이 있다고 느꼈다. `ProjectService`와 같은 API 클라이언트가 의존하는 서버가 BFF 서버에서 다른 API 서버로 변경될 때이다.

아래 코드를 보면 알겠지만, 엔드포인트가 `/api/projects/${projectId}`와 같이 직접 의존하고 있기 때문이다.

```typescript
fetchProject(projectId: string) {
  return this.get<Project>(`/api/projects/${projectId}`);
}
```

그래서 의존할 서버의 교체를 고려하여 엔드포인트 Record에 의존하게 했다.

```typescript
const API_SERVER_PATHS = {
  projects: '/api/projects',
  ...
} as const;

fetchProject(projectId: string) {
  return this.get<Project>(`${API_SERVER_PATHS.projects}/${projectId}`);
}
```

이제 `ProjectService`와 같은 API 클라이언트들은 **Supabase SDK에 의존하지 않는다.** 나중에 BFF 마저도 사라지게 된다면, 엔드포인트들만 교체해주면 된다.

#### 정말로 찾아온 자체 API 서버로의 전환

서비스의 성장과 함께 Supabase의 한계를 더욱 명확히 느끼게 되었다.
주요 전환 동기는 다음과 같았다.

- 복잡해지는 비즈니스 로직
- 풀스택 앱이 갖는 복잡성
- 전문 백엔드 인력 채용

그리고 앞서 구축한 추상화 계층 덕분에 전환 과정이 용이했다.

## 결론

제어의 역전 달성과 최소한의 추상화는 우리 개발팀에 유연성을 제공했다.

최근 제품과 개발팀이 커지면서, 이런 경험들이 많아지고 있는데 혼자 학습하고 고민했던 것들이 헛되지 않았다는 게 느껴지기도 하고, 개발에 대한 성취감도 상당히 높아졌다.

이전에는 기술이나 코드로 문제를 해결하는 것보다는 그 외 방법으로 문제를 해결하는 게 더 재밌었는데, 지금은 개발이 역전한 것 같다.
