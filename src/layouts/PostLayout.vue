<template>
  <div class="post-root">
    <div class="post-root__sidebar"></div>
    <div class="post-root__content">
      <Content />
      <CopyRight />
      <div v-if="createdAt || updatedAt" class="post-root__content_time">
        <div v-if="createdAt !== updatedAt">创建于: {{ updatedAt }}</div>
        <div v-else>更新于: {{ updatedAt }}</div>
      </div>
      <SafeBottom />
    </div>
    <div class="post-root__menu"></div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';

import CopyRight from '@/components/CopyRight/index.vue';
import SafeBottom from '@/components/SafeBottom/index.vue';

const { page } = useData();

const { timeInfo } = page.value as any;

const { createdAt, updatedAt } = timeInfo || {};
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
    @include padding(0 0 10px 0);

    @include response($mobile) {
      @include padding(10px);
    }

    &_time {
      @include flex(row, space-between, center);
      @include padding(0 0 0 4px);
      color: var(--td-text-color-secondary);
      font-size: 12px;
    }
  }

  &__menu {
    position: fixed;
  }
}
</style>
