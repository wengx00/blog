<template>
  <div class="home-root">
    <div class="home-layout">
      <div class="home-layout__section">
        <div class="home-layout__section_title">近期博客</div>
        <TransitionGroup name="list">
          <div
            v-for="(item, index) in recentBlogs"
            :key="index"
            class="home-layout__section_item"
            @click="goPostDetail(item.url)"
          >
            <div class="title">{{ item.title }}</div>
            <div class="date">{{ item.date }}</div>
          </div>
        </TransitionGroup>
        <Button
          v-if="recentData.length > recentIndex"
          variant="text"
          class="load-more"
          theme="default"
          size="large"
          @click="loadMore"
        >
          加载更多
        </Button>
      </div>
      <div class="home-layout__section">
        <div class="home-layout__section_title">标签归档</div>
        <div
          v-for="{ name, posts, bgColor } in tags"
          :key="name"
          class="home-layout__section_item"
          @click="goArchive(name)"
        >
          <div class="tag-row">
            <div :style="{ background: bgColor }" class="tag-color"></div>
            <div class="tag-name">{{ name }}</div>
          </div>
          <div class="tag-post-count">{{ posts.length }} 篇</div>
        </div>
      </div>
      <SafeBottom />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'tdesign-vue-next';
import { useRouter, withBase } from 'vitepress';
import { ref } from 'vue';

import SafeBottom from '@/components/SafeBottom/index.vue';
import { data as archiveData } from '@/loaders/archive.data';
import { data as recentData, type RootMetaData } from '@/loaders/root.data';
import { dateUtils } from '@/utils';

const DEFAULT_RENCENT_COUNT = 5;
const { tags } = archiveData;

const router = useRouter();

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
const recentBlogs = ref(
  recentData.slice(0, DEFAULT_RENCENT_COUNT).map(infoHandler),
);
const recentIndex = ref(DEFAULT_RENCENT_COUNT);

// 加载更多
const loadMore = () => {
  if (recentIndex.value >= recentData.length) {
    return;
  }
  const nextIndex = recentIndex.value + DEFAULT_RENCENT_COUNT;
  recentBlogs.value.push(
    ...recentData.slice(recentIndex.value, nextIndex).map(infoHandler),
  );
  recentIndex.value = nextIndex;
};

const goPostDetail = (url: string) => {
  router.go(withBase(url));
};

const goArchive = (name: string) => {
  router.go(withBase(`/archive/${name}`));
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

  .tag-row {
    @include flex(row, flex-start, center);

    > * {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }

    .tag-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }
    .tag-name {
      color: var(--td-text-color-secondary);
    }
  }
  .tag-post-count {
    color: var(--td-text-color-secondary);
    font-size: 14px;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
