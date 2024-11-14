---
date: 2024-11-15T00:45:00+08:00
title: 极简响应式原理
tags:
  - Web前端
---

# 极简响应式原理


想必每个 Front-end Developer 都用过 / 接触过非常 🔥 火热的框架：Vue，下面是 Vue3 的一段很常见的写法：

```js
const price = ref(0);
const quantity = ref(0);

const totalPrice = computed(() => price * quantity);

onMounted(async () => {
	const { price, quantity } = shoppingApi.getPriceAndQuantity();
	price.value = price;
	quantity.value = quantity;
	console.log(totalPrice); // Reactive Result Shown!!
})
```

Wow， `price` 和 `quantity` 的改变可以自动引起 `totalPrice` 的计算 / 组件的自动更新，好酷。

这就是响应式的数据，在 Vue、Preact、Omi、mobx 等框架上大行其道。

响应式的过程简单来说，就是：

- 自动收集数据依赖项
- 数据依赖改变时自动更新

在 Vue2 中，是通过 `Object.defineProperty` 进行数据劫持来收集依赖的，而在 Vue3、Preact 中，这个过程借助了 `Proxy` ，通过对原有数据进行代理，在 `get` 方法上收集依赖，在 `set` 方法上触发依赖自己的数据的更新即可。

为了方便理解这个过程，可以用极致少的代码来实现这个功能（这里并不像 Vue3 的实现，反而更像 Preact）

```tsx
let activeEffect: Function | null = null;

export interface Signal<T> {
  value: T;
}

export type EffectFn = () => void;
export type ComputedFn<T> = () => T;

export function signal<T>(defaultValue?: T) {
  let value = defaultValue;
  const deps = new Set<Function>();

  const proxy = new Proxy({} as Signal<T>, {
    get(_, propKey) {
      if (propKey === "value") {
        if (activeEffect) {
          deps.add(activeEffect);
        }
        return value;
      }
    },
    set(_, propKey, newValue) {
      if (propKey === "value") {
        value = newValue;
        deps.forEach((effect) => effect());
        return true;
      }
      return false;
    },
  });

  return proxy;
}

export function effect(fn: EffectFn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

export function computed<T>(fn: ComputedFn<T>) {
  const record = signal<T>();
  effect(() => (record.value = fn()));
  return record;
}
```

用以上的代码可以写一个简单的用例来感受其响应式：

```ts
const price = signal(100);
const quantity = signal(20);

const totalPrice = computed(() => price.value * quantity.value);

console.log(totalPrice.value); // Output: 2000
price.value = 40;
console.log(totalPrice.value); // Output: 800
```

好了，让我们来逐步拆分这一小段 Demo

1. `activeEffect` 记录了更新当前数据的方法
2. 在访问被 `signal` 包裹的响应式数据前，将即将执行方法赋值给 `activeEffect` ，然后再调用该方法
3. `signal` 中的数据需要通过 `value` 来访问， `proxy` 会代理对 `value` 的 `get` 请求，并且将当前的 `activeEffect` 记录在收集依赖的 `set` 中。
4. 当 `signal` 中的 `value` 被设置时，执行收集依赖的 `set` 中记录的所有更新方法。

:::tip 💡
上面的代码是极度简化的，只保留了核心的响应式能力，而在 Preact 中，还有批量执行 update 方法的能力。对于 Vue 来说，记录依赖的方式要更加复杂一些。
:::

***一些更细致的源码：***

1. Vue3：https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts#L76
2. Omi：https://github.com/Tencent/omi/blob/master/packages/reactive-signal/src/reactivity.ts
3. Preact：https://github.com/preactjs/signals/blob/main/packages/core/src/index.ts

***推荐看 Vue Mastery 的视频 / 文档***

1. Vue Mastery 原课程：https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity
2. 中英翻译版：https://www.bilibili.com/video/BV1SZ4y1x7a9/
