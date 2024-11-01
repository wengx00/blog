---
outline: deep
---

# Runtime API Examples | 运行时 API 示例

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## 1. Results

### 1.1 Theme Data
<pre>{{ theme }}</pre>

### 1.2 Page Data
<pre>{{ page }}</pre>

### 1.3 Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## 1. Results

### 1.1 Theme Data
<pre>{{ theme }}</pre>

### 1.2 Page Data
<pre>{{ page }}</pre>

### 1.3 Page Frontmatter
<pre>{{ frontmatter }}</pre>

## 2. More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).

## 3. 二级标题

### 3.1 三级标题

#### 3.1.1 四级标题

#### 3.1.2 四级标题

##### 3.1.2.1 五级标题

###### 3.1.2.1.1 六级标题

### 3.2 三级标题
