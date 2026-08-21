---
slug: adapter-pattern-in-react
title: 서로 다른 인터페이스를 하나의 인터페이스로, 어댑터 패턴 실전 적용기
description: "결제 수단 변경 기능을 구현하며 마주친 컴포넌트 인터페이스 불일치 문제를 React에서 어댑터 패턴으로 해결한 실전 경험."
authors: m1nsuppp
tags: [react, software-design, frontend]
---

결제 수단 변경 기능을 구현하며 마주쳤던 컴포넌트 인터페이스 문제를 어댑터 패턴으로 해결한 경험

<!--truncate-->

## 배경

사용자의 결제 경험을 개선하기 위한 가장 흔한 해결 방안 중 하나는 다양한 결제 수단을 제공하는 것이다. 그래서 우리 팀은 지속적으로 결제 수단을 늘려왔다.

그런데 며칠 전, 사용자로부터 결제 수단을 변경할 수 있게 해달라는 요청이 들어왔다. 이에 따라 우리 팀은 결제 수단 변경 기능을 개발하기로 했다.

API 서버에서는 기존 구독 API를 확장하여 결제 수단 변경 기능을 추가했다.

- 같은 구독 플랜에 대해 결제 수단만 바꾸어 API 서버에 요청하는 것이었다.

그리고 프론트엔드도 이에 맞추어 결제 수단 컴포넌트에 대한 핸들러를 수정하면 손 쉽게 해결할 수 있을 것이라고 생각했다.

## 문제

하지만, 언제나 그렇듯 가볍게 생각한 문제가 마냥 가볍지만은 않았다.

```tsx
// 결제 페이지
function PaymentPage() {
  ...

  return (
    <Layout>
      <FirstEasyPaymentMethod
        planType={planType}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFail={handlePaymentFail}
      />
      <SecondEasyPaymentMethod
        planType={planType}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFail={handlePaymentFail}
      >
      {/* ... */}

      {/* ... */}

      {(() => {
        if (hasRegisteredCreditCard) {
          return (
            <RegisteredCreditCard
              planType={planType}
              onEditCreditCardButtonClick={handleEditCreditCardButtonClick}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFail={handlePaymentFail}
            />
          );
        }

        return (
          <RegisterNewCreditCard
            onRegisterCreditCardSuccess={handleRegisterCreditCardSuccess}
            onRegisterCreditCardFail={handleRegisterCreditCardFail}
          />
        );
      })()}

    </Layout>
  );
}
```

### 문제 1: 서로 다른 인터페이스를 가진 결제 컴포넌트들

각각의 결제 수단 컴포넌트들은 자신만의 인터페이스를 가지고 있었다.

이는 각 결제 수단의 특성과 개발 시점이 달랐기 때문이다. 어쩔 수 없다. 우리가 만든 레거시기 때문에 안고가야했다.

이렇게 서로 다른 인터페이스는 요구사항 변경에 대한 문제를 야기했다.

- 컴포넌트마다 다른 props 네이밍으로 인한 일관성 부족
- 결제 성공/실패 핸들링 로직 중복
- 새로운 결제 수단 추가 시, 매번 다른 인터페이스 고려

### 문제 2: "결제"라는 행동에 종속된 인터페이스

기존 인터페이스는 "결제"라는 특정 행위에 종속되어 있었다.

하지만 이제는 "결제 수단 변경"이라는 새로운 유스케이스가 추가됐다.

```tsx
// 결제 수단 변경 페이지
function 결제_수단_변경_페이지() {
  // 🤔 기존 컴포넌트를 어떻게 재사용할까요?
  return (
    <Layout>
      <FirstEasyPaymentMethod
        // 💭 onPaymentSuccess라는 이름이 적절하지 않음
        onPaymentSuccess={handleChangePaymentMethodSuccess}
        onPaymentFail={handleChangePaymentMethodFail}
      />
      {/* ... */}
    </Layout>
  );
}
```

### 해결 방안: 어댑터 패턴 적용

이러한 문제들을 어떻게 해결할 수 있을지 고민했고, 어댑터 패턴을 적용하기로 했다.

먼저 "결제 수단 변경"을 책임지는 컴포넌트들이 공통적으로 사용할 수 있는 통일된 인터페이스를 정의했다.

```typescript
interface 결제_수단_변경_Props {
  onSuccess: (successResponse: SuccessResponse) => void;
  onFail: (failResponse: FailResponse) => void;
}
```

그 후, 각 결제 수단에 대해서 "변경"을 수행하는 컴포넌트들을 분리했다.

```tsx
function A로_결제_수단_변경(props: 결제_수단_변경_Props) { ... }

function B로_결제_수단_변경(props: 결제_수단_변경_Props) { ... }

function 신용카드로_결제_수단_변경(props: 결제_수단_변경_Props) {
  const [
    isEditCreditCardButtonClicked,
    setIsEditCreditCardButtonClicked
  ] = useState<boolean>(false);

  ...

  if (!isEditCreditCardButtonClicked && hasRegisteredCreditCard) {
    return (
      <RegisteredCreditCard
        onEditButtonClick={() => setIsEditCreditCardButtonClicked(true)}
      />
    );
  }

  return (
    <RegisterNewCreditCard
      onSuccess={props.onSuccess}
      onFail={props.onFail}
    />
  );
}
```

이렇게 "결제 수단 변경"을 책임지는 컴포넌트들을 따로 분리하고, 다음과 같이 페이지를 완성시켰다.

```tsx
function 결제_수단_변경_페이지() {
  const props: 결제_수단_변경_Props = {
    onSuccess: handleSuccess,
    onFail: handleFail,
    planType: currentUserPlanType,
  };

  return (
    <A로_결제_수단_변경
      {...props}
    />
    {/* ... */}

    <신용카드로_결제_수단_변경
      {...props}
    >
  )
}
```

## 회고 및 교훈

어댑터 패턴을 적용하면서 몇 가지 중요한 교훈을 얻을 수 있었던 것 같다.

### 1. 인터페이스 설계의 중요성

- 특정 행위에 종속적인 네이밍은 컴포넌트의 재사용성을 떨어뜨림
- 더 일반적이고 유연한 인터페이스 설계가 필요

### 2. 점진적 리팩토링

- 한 번에 모든 컴포넌트를 수정하지 않고, 어댑터를 통해 점진적으로 개선
- 기존 코드의 동작을 유지하면서 안전하게 리팩토링 가능

---

이러한 경험을 통해, 어댑터 패턴이 단순히 이론적인 디자인 패턴이 아니라 실제 개발 현장에서 매우 유용한 도구라는 것을 깨달았다.
나와 비슷한 문제를 겪고 있다면, 어댑터 패턴의 적용을 고려해보는 것도 좋을 것 같다.
