import { createContentLoader } from 'vitepress';

import { tagColor } from '../config';

const { background: BG_COLOR_MAP, text: COLOR_MAP } = tagColor;

export default createContentLoader('**/*.md', {
  transform(rawData) {
    const tagMapping: Record<string, TagMetaData> = {};
    const postList: ArchiveMetaData[] = [];
    rawData.forEach((item, index) => {
      const { frontmatter } = item;
      const curTags = frontmatter.tags || frontmatter.tag || [];
      const tagList = Array.isArray(curTags)
        ? curTags
        : String(curTags).split(',');
      if (!tagList.length) {
        tagList.push('未分类');
      }
      const pureTagList = tagList
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => {
          const tagItem = {
            name: tag,
            color: COLOR_MAP[tag] || COLOR_MAP['未分类'],
            bgColor: BG_COLOR_MAP[tag] || BG_COLOR_MAP['未分类'],
            posts: [],
          };
          if (!tagMapping[tag]) {
            tagMapping[tag] = tagItem;
          }
          return tag;
        });
      const uniqueTagList = Array.from(new Set(pureTagList));
      const postItem = {
        index,
        tags: uniqueTagList,
        ...item,
      };
      postList.push(postItem);
    });
    Object.values(tagMapping).forEach(({ name, ...rest }) => {
      tagMapping[name] = {
        ...rest,
        name,
        posts: postList
          .filter(({ tags }) => tags.includes(name))
          .map(({ index }) => index),
      };
    });
    return {
      tags: tagMapping,
      posts: postList,
    };
  },
});

export interface ArchiveMetaData {
  url: string;
  frontmatter: {
    date?: string;
    title?: string;
    description?: string;
  };
  tags: string[];
  index: number;
}

export interface TagMetaData {
  name: string;
  color: string;
  bgColor: string;
  posts: number[];
}

export type ArchiveData = {
  tags: Record<string, TagMetaData>;
  posts: ArchiveMetaData[];
};
declare const data: ArchiveData;

export { data };
