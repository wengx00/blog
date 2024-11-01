<template>
  <div class="app-root">
    <div class="app-root__header">
      <AppHeader />
    </div>
    <div class="app-root__content">
      <template v-if="frontmatter.home">
        <HomeLayout />
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
import HomeLayout from './layouts/HomeLayout.vue';
import PostLayout from './layouts/PostLayout.vue';

// https://vitepress.dev/reference/runtime-api#usedata
const { frontmatter } = useData();

onMounted(() => {
  console.log('%cfrontmatter', 'color: #2196f3;', frontmatter.value);
  document.documentElement.setAttribute('theme-mode', 'light');
});
</script>

<style lang="scss" scoped>
.app-root {
  position: relative;
  width: 100%;

  &__header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99;
  }

  &__content {
    width: 100%;
    overflow-x: hidden;
    @include padding($headerHeight 0 0 0);
  }
}
</style>
