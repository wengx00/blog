<template>
  <div class="home-root">
    <div class="home-layout">
      <div class="home-layout__section">
        <div class="home-layout__section_title">近期博客</div>
        <div
          v-for="(item, index) in recentBlogs"
          :key="index"
          class="home-layout__section_item"
          @click="goPostDetail(item.url)"
        >
          <div class="title">{{ item.title }}</div>
          <div class="date">{{ item.date }}</div>
        </div>
        <Button
          v-if="data.length > recentIndex"
          variant="outline"
          class="load-more"
          size="large"
          theme="default"
          @click="loadMore"
        >
          加载更多
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'tdesign-vue-next';
import { withBase } from 'vitepress';
import { ref } from 'vue';

import { data, type RootMetaData } from '@/loaders/root.data.js';
import { dateUtils } from '@/utils';

const DEFAULT_RENCENT_COUNT = 5;

const infoHandler = (data: RootMetaData) => {
  const {
    url,
    frontmatter: { title = '无主题', date, description = '懒到什么描述都没有' },
  } = data;

  const formattedDate = dateUtils.getDateTimeString(new Date(date), {
    second: false,
    hour: false,
    minute: false,
  });

  return {
    url,
    title,
    description,
    date: formattedDate,
  };
};

// 近期博客
const recentBlogs = ref(data.slice(0, DEFAULT_RENCENT_COUNT).map(infoHandler));
const recentIndex = ref(DEFAULT_RENCENT_COUNT);

// 加载更多
const loadMore = () => {
  if (recentIndex.value >= data.length) {
    return;
  }
  const nextIndex = recentIndex.value + DEFAULT_RENCENT_COUNT;
  recentBlogs.value.push(
    ...data.slice(recentIndex.value, nextIndex).map(infoHandler),
  );
  recentIndex.value = nextIndex;
};

const goPostDetail = (url: string) => {
  window.open(withBase(url));
};
</script>

<style lang="scss" scoped>
.home-root {
  @include flex(row, center, flex-start);
  position: relative;
  width: 100%;
}
.home-layout {
  @include flex(column, flex-start, stretch);
  width: min($mobile, 100%);
  flex-shrink: 0;
  overflow-x: hidden;
  @include padding(20px 0);

  @include response($mobile) {
    @include padding(10px);
  }

  > * {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section {
    @include flex(column, flex-start, stretch);

    > * {
      margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    &_title {
      font-size: 17px;
      font-weight: 600;
    }

    &_item {
      @include flex(row, space-between, flex-start);
      @include padding(12px);
      background: var(--bg-color-component);
      transition: background-color 0.3s;
      border-radius: 8px;

      @include hover() {
        cursor: pointer;
        &:hover {
          background: var(--bg-color-component-hover);
        }
      }

      &:active {
        background: var(--bg-color-component-hover);
      }

      .title {
        font-size: 15px;
      }
      .date {
        font-size: 14px;
        color: var(--td-text-color-secondary);
      }
    }

    .load-more {
      width: fit-content;
      margin: 12px 0;
      align-self: center;
      cursor: default;

      @include hover() {
        cursor: pointer;
      }
    }
  }
}
</style>
