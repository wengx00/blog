<template>
  <div class="app-root">
    <div class="app-root__header">
      <AppHeader />
    </div>
    <div class="app-root__content">
      <template v-if="page.isNotFound">
        <NotFoundLayout />
      </template>
      <template v-else-if="frontmatter.home">
        <HomeLayout />
      </template>
      <template v-else-if="frontmatter.archive">
        <ArchiveLayout />
      </template>
      <template v-else>
        <PostLayout />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { onMounted } from 'vue';

import AppHeader from './components/AppHeader/index.vue';
import ArchiveLayout from './layouts/ArchiveLayout.vue';
import HomeLayout from './layouts/HomeLayout.vue';
import NotFoundLayout from './layouts/NotFoundLayout.vue';
import PostLayout from './layouts/PostLayout.vue';

// https://vitepress.dev/reference/runtime-api#usedata
const { frontmatter, page } = useData();

onMounted(() => {
  console.log('%cfrontmatter', 'color: #2196f3;', frontmatter.value);
  console.log('%cpage', 'color: #2196f3;', page.value);
});
</script>

<style lang="scss" scoped>
.app-root {
  display: contents;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: visible;

  &__header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99;
  }

  &__content {
    @include padding($headerHeight 0 0 0);
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: visible;
  }
}
</style>
