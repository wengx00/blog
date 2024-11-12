<template>
  <div class="page archive-root">
    <div class="archive">
      <div
        v-for="{ name, posts: postIndexList, bgColor } in displayTags"
        :key="name"
        class="archive__section"
      >
        <div class="archive__section_title tag-row">
          <div :style="{ background: bgColor }" class="tag-color"></div>
          <div class="tag-name">{{ name }}</div>
        </div>
        <div
          v-for="(item, index) in getPostListByIndex(postIndexList)"
          :key="index"
          class="archive__section_item"
          @click="goPostDetail(item.url)"
        >
          <div class="title">{{ item.frontmatter.title }}</div>
          <div v-if="item.date" class="date">
            {{ item.date }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData, useRouter, withBase } from 'vitepress';
import { computed } from 'vue';

import { data as archiveData } from '@/loaders/archive.data';
import { dateUtils } from '@/utils';

const { tags, posts } = archiveData;

const router = useRouter();
const { params } = useData();

const displayTags = computed(() => {
  const { name } = params.value || {};
  if (!name) {
    return Object.values(tags);
  }
  return [tags[name]].filter(Boolean);
});

const getPostListByIndex = (indexList: number[]) => {
  return indexList
    .map((index) => posts[index])
    .filter(({ frontmatter }) => !!frontmatter.title)
    .map((item) => ({
      ...item,
      date:
        item.frontmatter.date &&
        dateUtils.getDateTimeString(new Date(item.frontmatter.date), {
          second: false,
          minute: false,
          hour: false,
        }),
    }));
};

const goPostDetail = (url: string) => {
  router.go(withBase(url));
};
</script>

<style lang="scss" scoped>
.archive-root {
  @include flex(row, center, flex-start);
  position: relative;
  width: 100%;
}

.archive {
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
