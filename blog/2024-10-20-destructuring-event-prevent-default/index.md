---
slug: destructuring-event-prevent-default
title: 왜 Event.preventDefault()를 구조 분해 할당 하면 안 될까?
authors: m1nsuplee
tags: [javascript, this]
---

JavaScript에서 `Event.preventDefault()` 메서드를 구조 분해 할당 하면 어떤 문제가 발생할까? JavaScript의 `this` 바인딩 개념과 관련된 이유를 설명한다.

<!--truncate-->

## 배경

이미지 편집기 개발에 참여하기 위해 Canvas API에 대해 학습하던 중, 다음과 같이 `preventDefault` 메서드를 구조 분해 하여 사용하려고 했다.

```javascript
canvas.addEventListener("touchstart", ({ touches, preventDefault }) => {
  preventDefault();

  const { clientX, clientY } = touches[0];
  const { left, top } = canvas.getBoundingClientRect();

  startDrawing(clientX - left, clientY - top);
});
```

그러나 이 코드는 예상대로 작동하지 않았고, 다음과 같은 에러를 throw 한다는 것을 발견했다.

```text
Uncaught TypeError: Illegal invocation at HTMLCanvasElement.<anonymous>
```

- LLM, 검색 등을 활용하여 디깅해보니 해당 에러는 메서드가 올바른 컨텍스트에서 호출되지 않을 때 발생하는 에러라고 한다.
  - `this` 사용을 최대한 자제하며 개발을 하다보니, 처음 마주한 에러였다.

## JS의 `this` 이해하기

### 기본적으로 `this`는 `Window`다.

개발자도구에서 `this`를 확인해보면, 다음과 같은 결과가 나올 것이다.

```text
Window {window: Window, self: Window, document: document, name: '', location: Location, …}
```

보면 알 수 있듯이 `this`는 `Window`다.

그럼 어떤 함수 스코프 내의 `this`는 무엇일까?

```javascript
function fn() {
  console.log(this); // Window {window: Window, self: Window, document: document, name: '', location: Location, …}
}

function fn() {
  return this;
}

console.log({ isThis: fn() === this }); // { isThis: true }
```

위 결과를 보면 알 수 있듯이 함수 fn 스코프 내에서도 `this`는 `Window`다. 그리고 대부분 알고 있듯이 `Window`의 스코프는 global이다.

> 즉, 기본적으로 `this`는 `Window`다.

### `this`가 `Window`가 아닌 경우

```javascript
const obj = {
  a() {
    console.log(this);
  },
};

obj.a(); // {a: ƒ}

const m1nsup = {
  name: "이민섭",
  sayMyName() {
    console.log(this.name);
  },
};

m1nsup.sayMyName(); // 이민섭
```

위 예제에서 알 수 있듯이 객체의 메서드로 호출될 경우, `this`는 말 그대로 해당 객체를 가리킨다.

- `obj.a()`를 호출할 때, 점(.) 연산자는 `a` 메서드의 컨텍스트를 `obj`로 설정한다. 따라서 `a` 메서드 내부에서 `this`는 `obj`를 가리킨다.
- `m1nsup.sayMyName()`을 호출할 때, 점(.) 연산자는 `sayMyName` 메서드의 컨텍스트를 `m1nsup`로 설정한다. 따라서 `sayMyName` 메서드 내부에서 `this`는 `m1nsup`을 가리키고, `this.name`은 `"이민섭"`이 된다.

> 즉, **점(.)** 연산자를 사용하여 메서드를 호출하면, `this`는 해당 객체를 가리킨다.

- 사실상 그냥 외워야한다고 본다..

### 그런데 구조 분해 할당을 하게 된다면

당연히 예상대로 동작하지 않는다.

```javascript
const m1nsup = {
  name: "이민섭",
  sayMyName() {
    console.log(this.name);
  },
};

const { sayMyName } = m1nsup; // const sayMyName = m1nsup.sayMyName;

sayMyName(); // ''
```

구조 분해 할당은 값에 접근할 뿐이다. 즉 `sayMyName`은 더 이상 `m1nsup`객체의 메서드가 아닌 일반 함수가 된다. 즉 `this` 바인딩이 손실된다. 그래서 `sayMyName`의 `this`는 global(Window)이 된다.

## 그래서 왜 `Event.preventDefault()`를 구조 분해 하면 안 될까?

이제 본론으로 돌아와서, 왜 `Event.preventDefault()`를 구조 분해 하면 안 되는지 생각해보자.

### 구조 분해 구문에 의한 `this` 바인딩 손실

`Event.preventDefault()`는 `Event` 객체의 메서드로, 이 메서드가 호출될 때 `this`는 해당 `Event` 객체를 가리킨다. 그러나 구조 분해를 통해 메서드를 분리하면, 메서드가 더 이상 `Event` 객체의 컨텍스트에서 호출되지 않기 때문에 `this`가 올바르게 설정되지 않는다.

- 구조 분해 구문은 값에 접근할 뿐, `this` 바인딩을 자등으로 처리하지 않는다.

```javascript
canvas.addEventListener("touchstart", (event) => {
  const { preventDefault } = event; // const preventDefault = event.preventDefault
  preventDefault(); // Uncaught TypeError: Illegal invocation at HTMLCanvasElement.<anonymous>
});
```

이렇게 구조 분해를 사용하면, `preventDefault` 함수는 `Event` 객체로부터 분리되어 일반 함수처럼 취급되고, `this` 바인딩이 손실되어 함수가 제대로 작동하지 않는다.

- `Event` 객체 내 `preventDefault` 메서드가 아닌 `preventDefault`라는 이름을 갖는 함수가 되는 것이다.

### 그래도 구조 분해를 사용하고 싶다면?!

아래와 같이 `bind` 메서드를 사용하여 `this`를 명시적으로 바인딩할 수 있다.

```javascript
canvas.addEventListener("touchstart", (event) => {
  const { preventDefault } = event;
  const boundPreventDefault = preventDefault.bind(event);
  boundPreventDefault(); // 정상 작동
  ...
});
```

#### 참조

- [자바스크립트의 this는 무엇인가? - ZeroCho Blog](https://www.zerocho.com/category/JavaScript/post/5b0645cc7e3e36001bf676eb)

- [Stack Overflow](https://stackoverflow.com/questions/49616305/destructing-ev-preventdefault)
