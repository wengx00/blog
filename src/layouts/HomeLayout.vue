<template>
  <div>
    <div>
      <a :href="withBase('/api-examples')">API Examples</a>
    </div>
    <div>
      <a :href="withBase('/markdown-examples')">Markdown Examples</a>
    </div>
    <div>
      <a :href="withBase('/todo')">Todo List</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress';

import { data } from '@/loaders/root.data.js';

console.log('data-loader', data);
</script>

<style lang="scss" scoped></style>
