---
title: Node.js C++ Addon
date: 2024-11-15T11:15:00+08:00
tags:
  - Node.js
---

# Node.js C++ Addon

[[TOC]]

## 快速示例

```cpp
#include <node.h>

using namespace v8;

void AddMethod(const FunctionCallbackInfo<Value> &args)
{
  if (args.Length() < 2) {
    return;
  }
  
  Isolate *isolate = args.GetIsolate();
  // 可以通过 isolate 拿到其持有的 HandleScope
  HandleScope scope(isolate);
  Local<Context> context = isolate->GetCurrentContext();

  Local<Value> arg1 = args[0];
  Local<Value> arg2 = args[1];

  if (!arg1->IsNumber() || !arg2->IsNumber())
  {
    return;
  }

  args.GetReturnValue().Set(arg1->NumberValue(context).ToChecked() + arg2->NumberValue(context).ToChecked());
  // 返回字符串的话 String::NewFromUtf8(isolate, "Hello World");
}

// 以下为桩代码
void init(Local<Object> exports)
{
  // 导出名为 hello 的函数，可以在 JS 中用 add 作为名称来调用
  NODE_SET_METHOD(exports, "add", AddMethod);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init);
```

- FunctionCallbackInfo&lt;Value&gt;& args 是 V8 里很固定的写法
- Isolate 可以理解为一个独立的虚拟机，有独立的 GC，比如浏览器里不同的 Tab 就是不同的 isolate
  - 一个 Isolate 下可以有不同的 Context（JavaScript 上下文），比如 window 和其孩子 iframe 之间都是不同的 Context
  - 每个 Isolate 都有自己的 HandleScope 用于内存管理

## 接收并执行 JS 传递的回调函数


```cpp
void RunCallback(const FunctionCallbackInfo<Value> &args) {
  if (args.Length() < 1)
    return;
  Isolate *isolate = args.GetIsolate();
  HandleScope scope(isolate);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned int argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate, "Hello World").ToLocalChecked()};
  cb->Call(context, Null(isolate), argc, argv);
}
```

- `Local<Function>::Cast` 转换 JS 回调函数

## 编译 C++ Addon

使用 node-gyp 来编译 C++ 代码，需要编写 binding.gyp 来描述模块里包含哪些 native 代码

下面是一个 binding.gyp 的示例

```json
{
    "targets": [
        {
            "target_name": "custom_add",
            "sources": ["./custom_add.cc"]
        }
    ]
}
```


以上的配置编译后会生成 1 个可以被 require 的模块（如果配置的 targets 不止一个，就会编译出多个模块）

编译步骤：

1. 生成 Makefile（会生成 build 目录）

    ```bash
    node-gyp configure
    ```

2. 编译出 node 文件（会在 build/Release 中生成 .node 文件）

    ```bash
    node-gyp build
    ```

    .node 相当于一个动态库

## ESM 不支持 import .node 怎么办

1. 改造成 CommonJS（.cjs）
2. 保持 ESModule，使用 createRequire 来创建 ESM 下的 require

```js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const { add, runCallback } = require('./build/Release/custom_add.node');

console.log(add(1.992, 2.1187));
runCallback(console.log);
```
***顺便在此贴一下 ESM 下构造 __dirname 的方法***

```js
const __dirname = new URL('.', import.meta.url).pathname;
```
