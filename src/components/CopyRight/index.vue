<template>
  <div class="copyright">
    本文为 <a :href="theme.actions?.github">ccweng</a> 原创文章，遵循
    <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans">
      CC 4.0 BY-SA </a
    >版权协议，转载请附上原文出处链接及本声明。<br />
    原文链接：<a :href="address">{{ address }}</a>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, onBeforeMount, ref } from 'vue';

const { page, site, theme } = useData();

const remoteUrl = ref('https://wengx00.github.io');

const address = computed(
  () =>
    `${remoteUrl.value}${site.value.base}${page.value.relativePath.slice(0, -3)}`,
);

onBeforeMount(() => {
  remoteUrl.value = window.location.origin;
});
</script>

<style scoped lang="scss">
.copyright {
  @include padding(12px);
  margin: 16px 0 8px 0;
  width: 100%;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-color-component);
  color: var(--td-text-color-secondary);
  border: 2px dashed var(--border-color-level-2);
  font-size: 15px;
  user-select: text;
}
</style>
