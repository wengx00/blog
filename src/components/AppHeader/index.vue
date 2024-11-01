<template>
  <div class="app-header">
    <div class="app-header__title" @click="toHomeHandler">{{ site.title }}</div>
    <div class="app-header__actions">
      <t-button
        v-if="theme.actions?.github"
        :href="theme.actions.github"
        shape="circle"
        theme="default"
        size="large"
        variant="text"
        class="item"
      >
        <template #icon> <LogoGithubIcon /> </template>
      </t-button>
      <t-switch
        :value="currentTheme"
        class="item"
        size="large"
        :custom-value="['dark', 'light']"
        :on-change="setTheme"
      >
        <template #label="{ value }">
          <MoonIcon v-if="value === 'dark'" />
          <SunnyIcon v-else />
        </template>
      </t-switch>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { LogoGithubIcon, MoonIcon, SunnyIcon } from 'tdesign-icons-vue-next';
import { useData, useRouter, withBase } from 'vitepress';

import { themeStore } from '@/data';

const { site, theme } = useData();
const router = useRouter();

const { currentTheme } = storeToRefs(themeStore());
const { setTheme } = themeStore();

const toHomeHandler = () => {
  router.go(withBase('/'));
};
</script>

<style scoped lang="scss">
.app-header {
  @include flex(row, flex-start, center);
  @include padding(0 36px);
  width: 100%;
  background-color: var(--bg-color-page);
  height: $headerHeight;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-color-level-1);

  @include response($mobile) {
    @include padding(0 16px);
  }

  &__title {
    transition: all 0.3s;

    @include hover() {
      cursor: pointer;

      &:hover {
        color: var(--td-text-color-brand);
      }
    }
  }

  &__actions {
    @include flex(row, flex-start, center);
    margin-left: auto;

    > .item {
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
