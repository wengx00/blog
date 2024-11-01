<template>
  <div class="post-root">
    <div class="post-root__sidebar"></div>
    <div class="post-root__content">
      <Content />
      <SafeBottom />
    </div>
    <div class="post-root__menu"></div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';

import SafeBottom from '@/components/SafeBottom/index.vue';

const { page } = useData();

console.log(page.value);
</script>

<style scoped lang="scss">
.post-root {
  @include flex(row, center, flex-start);
  position: relative;
  width: 100%;
  margin-bottom: 8px;

  &__sidebar {
    position: fixed;
  }

  &__content {
    width: min($mobile, 100%);
    flex-shrink: 0;
    overflow-x: hidden;

    @include response($mobile) {
      @include padding(10px);
    }
  }

  &__menu {
    position: fixed;
  }
}
</style>
