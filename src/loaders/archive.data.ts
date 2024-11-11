import { createContentLoader } from 'vitepress';

const BG_COLOR_MAP: Record<string, string> = {
  未分类: 'var(--bg-color-component)',
};

const COLOR_MAP: Record<string, string> = {
  未分类: 'var(--td-text-color-primary)',
};

export default createContentLoader('**/*.md', {
  transform(rawData) {
    const tagMapping = new Map<string, ArchiveMetaData[]>();
    rawData.forEach((item, index) => {
      const { frontmatter } = item;
      const curTags = frontmatter.tags || frontmatter.tag || [];
      const tagList = Array.isArray(curTags)
        ? curTags
        : String(curTags).split(',');
      if (!tagList.length) {
        tagList.push('未分类');
      }
      const tagInfoList = tagList
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => {
          const tagItem = {
            name: tag,
            color: COLOR_MAP[tag] || COLOR_MAP['未分类'],
            bgColor: BG_COLOR_MAP[tag] || BG_COLOR_MAP['未分类'],
          };
          return tagItem;
        });
      tagInfoList.forEach(({ name }) => {
        const postList = tagMapping.get(name) || [];
        if (postList.find(({ index: idx }) => index === idx)) {
          return;
        }
        postList.push({
          ...item,
          index,
          tags: tagInfoList,
        });
        tagMapping.set(name, postList);
      });
    });
  },
});

export interface ArchiveMetaData {
  url: string;
  index: number;
  frontmatter: {
    date?: string;
    title?: string;
    description?: string;
  };
  tags: {
    name: string;
    color?: string;
    bgColor?: string;
  }[];
}

export type ArchiveData = Record<string, ArchiveMetaData[]>;
declare const data: ArchiveData;

export { data };
