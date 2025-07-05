---
slug: multi-tenant-configuration-model
title: 고객사별 맞춤형 B2B SaaS로 나아가기 위한 데이터 모델링 전략
authors: m1nsuppp
tags: [data structure]
---

Configurable Schema를 활용해 다양한 고객사의 요구사항을 하나의 코드로 만족시키기 위해 노력했던 고민

<!--truncate-->

## 들어가며

B2B SaaS 제품을 개발하다 보면 피할 수 없는 문제가 있다. 바로 고객사마다 다른 요구사항이다. 특히 데이터 구조, UI 표현, 그리고 비즈니스 로직에 있어서 각 고객사는 자신들만의 방식을 원한다. 이런 상황에서 고객사가 늘어날 때마다 새로운 코드를 작성하거나 데이터베이스 스키마를 변경하는 것은 지속 가능한 방법이 아니다.

개발자로서, 이 문제를 해결하기 위해 Configurable Schema와 메타데이터 기반 접근법을 구현했다. 이 글에서는 데이터 모델, UI 구성, 그리고 복잡한 비즈니스 로직까지 설정 기반으로 처리한 과정과 해결책을 공유하고자 한다.

## 직면했던 문제: 다양한 도메인, 다양한 요구사항

우리 서비스는 다양한 업종의 고객사를 대상으로 3D 제품 뷰어와 대시보드를 제공한다. 가장 많은 업종은 인테리어/가구 회사부터 아주 버티컬한 사업을 하는 자동차 특장차 제작업체까지, 각 업종마다 중요하게 생각하는 데이터가 달랐다.

- A 가구사는 프리셋의 총 치수, 재질, 조명의 총 전력량을 표시하길 원했다.
- B 가구사는 선반이 2단, 3단, 5단인지를 표시하길 원했다.
- 자동차 특장차 제작업체는 하중과 같은 업계 특화 데이터를 표시하길 원했다.

더 큰 문제는 같은 업종 내에서도 각 회사마다 사용하는 용어가 달랐다는 점이다. 이는 단순한 UI 문제가 아니라 데이터 모델링의 문제였다.

그리고 가장 복잡했던 부분은 비즈니스 로직이었다. 예를 들어, 가격 계산 방식이 고객사마다 완전히 달랐다.

- 일부 가구사는 제품 너비에 따라 가격이 증가하는 방식을 사용했다.
- 다른 회사들은 재질과 옵션에 따른 복잡한 가격 계산 공식을 가지고 있었다.
- 특장차 제작업체는 하중 용량과 특수 기능에 따른 가격 체계를 원했다.

이미 여러 고객사를 지원해야 했고, 앞으로도 늘어날 고객사를 생각하면, 고객사별로 데이터베이스를 설계하거나 API를 새로 구현하는 것은 현실적으로 불가능했다. 더구나 각 고객사별로 다른 비즈니스 로직을 하드코딩하는 것은 유지보수 악몽이 될 것이 분명했다.

## 해결책: Configurable Schema

이 문제를 해결하기 위해 나는 매우 유연하게 설정 가능한 스키마를 설계할 수 있게 하면 어떨까 생각했다. 그리고 핵심 아이디어는 간단했다.

1. 모든 가능한 필드를 정의하는 메타데이터 계층 생성
2. 각 테넌트(고객사)별로 필요한 필드만 활성화하는 설정 계층 구현
3. 실제 데이터는 Configurable Schema에 따라 저장 및 표시

이를 Zod로 표현해보면 아래와 같다.

```typescript
import { z } from "zod";

// 필드 정의 스키마
const fieldDefinitionSchema = z.object({
  type: z.enum(["string", "number", "boolean", "array", "object", "date"]),
  isRequired: z.boolean().default(false),
  defaultValue: z.unknown().optional(),
  options: z.array(z.unknown()).optional(),
  validation: z.record(z.unknown()).optional(),
});

// 테넌트별 설정 스키마
const tenantConfigSchema = z.object({
  fields: z.array(z.string()),
  labels: z.record(z.string()),
  order: z.array(z.string()).optional(),
});

// 전체 커스텀 데이터 스키마
export const customDataSchema = z.object({
  version: z.string().default("1.0"),
  fieldDefinitions: z.record(fieldDefinitionSchema).default({}),
  values: z.record(z.unknown()).default({}),
  tenantConfigs: z.record(tenantConfigSchema).default({}),
});

type CustomData = z.infer<typeof customDataSchema>;
```

이 스키마의 각 부분은 다음과 같은 역할을 한다.

- `fieldDefinitions`: 시스템에서 사용 가능한 모든 필드의 타입, 유효성 검사 규칙 등을 정의
- `values`: 실제 데이터 값을 저장
- `tenantConfigs`: 각 테넌트별로 어떤 필드를 사용할지, 어떤 레이블로 표시할지, 어떤 순서로 배치할지 정의

그리고 이 스키마를 사용하여 각 테넌트별로 필요한 데이터만 추출하고, 해당 테넌트에 맞는 레이블과 순서로 표시할 수 있었다. 이를 통해 하나의 데이터 모델로 다양한 고객사의 요구사항을 충족시킬 수 있었다.

## Server Driven UI: 백엔드에서 UI 구성 제어하기

다음 단계는 Server Driven UI 패턴 적용이었다.

우리의 3D 제품 뷰어에서는 다음과 같이 구현했다:

```typescript
// 서버에서 전달되는 UI 구성 정의
interface UIConfiguration {
  components: UIComponentDefinition[];
  layout: LayoutDefinition;
}

interface UIComponentDefinition {
  type: string; // "select", "text", "filter" 등
  id: string;
  properties: Record<string, unknown>;
}

// 클라이언트에서 UI 구성을 렌더링하는 함수
function renderUIComponent(
  component: UIComponentDefinition,
  tenantId: string
): React.ReactNode {
  switch (component.type) {
    case "select":
      return <SelectComponent {...component.properties} tenantId={tenantId} />;
    case "text":
      return <TextComponent {...component.properties} tenantId={tenantId} />;
    case "filter":
      return <FilterComponent {...component.properties} tenantId={tenantId} />;
    default:
      return null;
  }
}
```

이 접근법의 핵심은 UI 컴포넌트의 타입, 속성, 배치 등을 서버에서 JSON 형태로 전달받아 동적으로 렌더링하는 것이다. 이를 통해 코드 변경 없이도 다양한 고객사의 UI 요구사항을 충족시킬 수 있었다.

## 고객사 별 비즈니스 로직은?

데이터 스키마와 UI를 설정 기반으로 만든 후, 다음 도전 과제는 복잡한 비즈니스 로직을 처리하는 것이었다. 특히 가격 계산이나 할인 규칙과 같은 로직은 고객사마다 크게 달랐다.

이를 위해 우리는 선언적 규칙 엔진(Declarative Rules Engine)을 설계했다. 이 접근법의 핵심은 비즈니스 로직을 코드가 아닌 데이터로 표현하는 것이다.

여기서는 TypeScript의 타입 시스템으로 예를 들어본다.

```typescript
// 규칙 엔진 타입 정의
interface Rule {
  id: string;
  type: string;
  params: Record<string, unknown>;
  condition?: Condition;
}

interface Condition {
  operator: "and" | "or" | "not" | "eq" | "gt" | "lt" | "gte" | "lte";
  operands: Array<Condition | ConditionLeaf>;
}

interface ConditionLeaf {
  field: string;
  value: unknown;
}

interface RuleSet {
  id: string;
  name: string;
  description: string;
  rules: Rule[];
  version: string;
}

// 테넌트별 규칙 저장소
interface TenantRuleRepository {
  getRuleSet(tenantId: string, ruleSetId: string): Promise<RuleSet>;
  saveRuleSet(tenantId: string, ruleSet: RuleSet): Promise<void>;
}

// 규칙 실행기
class RuleEngine {
  private ruleHandlers: Record<string, RuleHandler> = {};
  private conditionEvaluator: ConditionEvaluator;

  constructor(conditionEvaluator: ConditionEvaluator) {
    this.conditionEvaluator = conditionEvaluator;
  }

  registerHandler(type: string, handler: RuleHandler): void {
    this.ruleHandlers[type] = handler;
  }

  async executeRuleSet(
    ruleSet: RuleSet,
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    let result = { ...context };

    for (const rule of ruleSet.rules) {
      // 조건이 있으면 평가
      if (
        rule.condition &&
        !this.conditionEvaluator.evaluate(rule.condition, result)
      ) {
        continue;
      }

      const handler = this.ruleHandlers[rule.type];
      if (!handler) {
        throw new Error(`No handler registered for rule type: ${rule.type}`);
      }

      // 규칙 실행 및 결과 업데이트
      result = await handler.execute(rule, result);
    }

    return result;
  }
}

// 규칙 핸들러 인터페이스
interface RuleHandler {
  execute(
    rule: Rule,
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>>;
}
```

이 추상화된 규칙 엔진을 사용하면 다양한 비즈니스 로직을 JSON 설정으로 표현할 수 있다. 예를 들어, 너비에 따른 가격 계산 규칙은 다음과 같이 표현할 수 있다.

```typescript
// 너비 기반 가격 계산 규칙 예시 (JSON 형태)
const widthBasedPricingRuleSet: RuleSet = {
  id: "pricing-rules-tenant-a",
  name: "너비 기반 가격 계산",
  description: "제품 너비에 따라 가격을 계산하는 규칙",
  version: "1.0",
  rules: [
    {
      id: "min-width-price",
      type: "setField",
      params: {
        field: "price",
        value: 640000,
      },
      condition: {
        operator: "lte",
        operands: [{ field: "width", value: 600 }],
      },
    },
    {
      id: "max-width-price",
      type: "setField",
      params: {
        field: "price",
        value: 896000,
      },
      condition: {
        operator: "gte",
        operands: [{ field: "width", value: 1200 }],
      },
    },
    {
      id: "incremental-price",
      type: "calculateField",
      params: {
        field: "price",
        formula:
          "basePrice + (Math.ceil((width - baseWidth) / incrementUnit) * pricePerUnit)",
        variables: {
          basePrice: 640000,
          baseWidth: 800,
          incrementUnit: 10,
          pricePerUnit: 12800,
        },
      },
      condition: {
        operator: "and",
        operands: [
          {
            operator: "gt",
            operands: [{ field: "width", value: 600 }],
          },
          {
            operator: "lt",
            operands: [{ field: "width", value: 1200 }],
          },
        ],
      },
    },
  ],
};
```

이제는 비즈니스 로직이 코드가 아닌 데이터로 표현되어 개발자가 아닌 사람도 이해하고 수정할 수 있다.

- 사실 아직까지는 나만 수정하고 있다😂
- 가까운 미래에 기능으로 출시될 예정이다.

이러한 규칙 엔진을 통해 우리는 다양한 고객사의 비즈니스 로직을 하나의 코드베이스로 처리할 수 있었다.

## 실제 적용 사례

현재 구현한 Configurable Schema와 Server Driven UI를 통해 다양한 고객사의 요구사항을 효과적으로 충족시킬 수 있었다. 다음은 각 고객사별로 어떻게 데이터와 UI를 구성할 수 있는지에 대한 예시다.

### 인테리어/가구 회사 A

```typescript
// A 가구사 테넌트 설정
const tenantAConfig = {
  fields: ["totalDimensions", "material", "lightingPower"],
  labels: {
    totalDimensions: "총 치수",
    material: "재질",
    lightingPower: "조명 전력량",
  },
  order: ["material", "totalDimensions", "lightingPower"],
};

// 서버에서 전달하는 UI 구성
const tenantAUIConfig = {
  components: [
    {
      type: "text",
      id: "title",
      properties: {
        content: "제품 상세 정보",
        style: "heading",
      },
    },
    {
      type: "select",
      id: "material-selector",
      properties: {
        label: "재질 선택",
        options: ["오크 원목", "월넛", "체리"],
        defaultValue: "오크 원목",
      },
    },
    {
      type: "filter",
      id: "dimension-filter",
      properties: {
        label: "치수 필터",
        field: "totalDimensions",
        options: ["소형", "중형", "대형"],
      },
    },
  ],
  layout: {
    type: "vertical",
    spacing: "medium",
  },
};
```

### 자동차 특장차 제작업체

```typescript
// 특장차 제작업체 테넌트 설정
const tenantCConfig = {
  fields: ["loadCapacity", "dimensions", "specialFeatures"],
  labels: {
    loadCapacity: "최대 하중",
    dimensions: "제원",
    specialFeatures: "특수 기능",
  },
};

// 서버에서 전달하는 UI 구성
const tenantCUIConfig = {
  components: [
    {
      type: "text",
      id: "title",
      properties: {
        content: "특장차 사양",
        style: "heading",
      },
    },
    {
      type: "select",
      id: "load-capacity",
      properties: {
        label: "하중 선택",
        options: ["1톤", "2.5톤", "5톤"],
        defaultValue: "2.5톤",
      },
    },
    {
      type: "filter",
      id: "feature-filter",
      properties: {
        label: "특수 기능 필터",
        field: "specialFeatures",
        options: ["냉동", "리프트", "크레인"],
      },
    },
  ],
  layout: {
    type: "grid",
    columns: 2,
  },
};
```

이러한 접근법을 통해 각 고객사는 자신들에게 필요한 필드와 UI 컴포넌트만 사용할 수 있게 되었으며, 하나의 코드베이스로 모든 고객사의 요구사항을 충족시킬 수 있었다.

## 비즈니스 가치

이러한 나의 고민들은 다음과 같은 비즈니스 가치를 가져왔다.

1. **확장성**: 새로운 고객사 온보딩 시 코드 변경 없이 설정만으로 요구사항 충족 가능
2. **비즈니스 민첩성**: 새로운 필드나 UI 컴포넌트 추가가 간단해짐
3. **개발 효율성**: 하나의 코드베이스로 모든 고객사 지원으로 개발 효율성 향상
4. **A/B 테스트 용이성**: 서버에서 UI 구성을 변경하여 쉽게 다양한 버전 테스트 가능(TBD와 같이 적용해보고 있다)

## 도전 과제와 해결책

물론 이 접근법에도 몇 가지 문제와 어려움이 남아있다.

- 개발자 경험
  - 디버깅이 어렵다...!
- 코드베이스 복잡성
  - 추상화 수준이 높아져서 코드의 이해도가 떨어진다.

## 결론

멀티 테넌트 B2B SaaS 개발에서 고객사별 요구사항을 효과적으로 처리하는 것은 큰 도전이었다. 그리고 앞으로도 계속해서 도전이 될 것 같다.

그래도 이 설계와 아이디어가 나에게는 큰 도움이 되었다. 특히나 확장성과 유지보수성 간의 트레이드오프, 아키텍처 복잡성 고려 등 아주 중요한 부분들도 고민해보고, 2년이 약간 넘는 개발 경력 중 가장 큰 도전이었다고 생각한다.

그래도 나름 프론트엔드와 백엔드를 아우르는 통합적 시각이 이런 복잡한 문제를 해결하는 데 큰 도움이 된 것 같다.

성장... 하고 있는 것 같긴하다..!
