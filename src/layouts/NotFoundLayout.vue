<template>
  <div class="page not-found-layout">
    <Empty title="Page Not Found" description="当前访问的页面不存在" />
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'tdesign-vue-next';
</script>

<style scoped lang="scss">
.not-found-layout {
  @include flex(column, center, center);
  overflow-y: hidden;
}
</style>
