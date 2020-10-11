### 一、建立组件 state 机制

#### 梳理函数内部的变量，将函数内部共享的变量放到 STATE 或 ATTRIBUTE 中

#### 如果需要将 STATE 和 ATTRIBUTE 私有化，可以将其声明为 Symbol。

```
export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");
```

#### 如果希望让扩展的继承组件共享变量，可以将对应的"Symbol" 通过 export 暴露给外部

```
export { STATE, ATTRIBUTE } from "./framework.js";
```

### 二、建立事件机制

#### 将事件注册统一放在 ATTRIBUTE 上

```
  triggerEvent(type, args) {
    this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, (s) => s.toUpperCase())](
      new CustomEvent(type, { detail: args })
    );
  }
```

#### 使用 CustomerEvent 提供类似原生 DOM 的事件通知机制，让组件的使用体验接近原生 HTML 标签

```
  <Carousel
    src={d}
    onChange={(event) => console.log(event.detail.position)}
    onClick={(event) => (window.location.href = event.detail.data.url)}
  />
```
