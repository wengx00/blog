<template>
  <div class="post-root">
    <div class="post-root__sidebar"></div>
    <div class="post-root__content">
      <Content />
      <CopyRight style="margin-top: 48px" />
      <div v-if="updatedAt" class="post-root__content_time">
        <div>更新于: {{ updatedAt }}</div>
      </div>
      <div class="post-root__content_comment">
        <Giscus 
          repo="wengx00/blog"
          repo-id="R_kgDONJGyDw"
          category="Announcements"
          category-id="DIC_kwDONJGyD84CkStq"
          mapping="pathname"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          theme="preferred_color_scheme"
          lang="zh-CN"
          crossorigin="anonymous"
        />
      </div>
      <SafeBottom />
    </div>
    <div class="post-root__menu"></div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';

import CopyRight from '@/components/CopyRight/index.vue';
import SafeBottom from '@/components/SafeBottom/index.vue';
import Giscus from '@giscus/vue';

import { dateUtils } from '@/utils';

const { page } = useData();

const { lastUpdated } = page.value;

const updatedAt = computed(() => {
  if (!lastUpdated) {
    return undefined;
  }
  const date = new Date(lastUpdated);
  return dateUtils.getDateTimeString(date, { minute: false });
});
</script>

<style scoped lang="scss">
.post-root {
  @include flex(row, center, flex-start);
  position: relative;
  width: 100%;

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

    &_comment {
      @include padding(36px 0 0 0);
      width: 100%;
    }
  }

  &__menu {
    position: fixed;
  }
}
</style>
