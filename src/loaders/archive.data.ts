import { createContentLoader } from 'vitepress';

import { tagColor, TagEnum } from '../config';

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
        tagList.push(TagEnum.UNTAG);
      }
      const pureTagList = tagList
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag: TagEnum) => {
          const tagItem = {
            name: tag,
            color: COLOR_MAP[tag] || COLOR_MAP[TagEnum.UNTAG],
            bgColor: BG_COLOR_MAP[tag] || BG_COLOR_MAP[TagEnum.UNTAG],
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
          .filter(
            ({ tags, frontmatter }) =>
              tags.includes(name) && !!frontmatter.title,
          )
          .sort((a, b) => {
            if (!a.frontmatter.date) {
              return 1;
            }
            if (!b.frontmatter.date) {
              return -1;
            }
            return (
              new Date(b.frontmatter.date).getTime() -
              new Date(a.frontmatter.date).getTime()
            );
          })
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
