import { createContentLoader } from 'vitepress';

export default createContentLoader('**/*.md', {
  transform(rawData) {
    return rawData
      .filter(({ frontmatter }) => !!frontmatter?.date)
      .sort(
        (a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date),
      );
  },
});

export interface RootMetaData {
  frontmatter: {
    date: string;
    title?: string;
    description?: string;
  };
  url: string;
}

export type RootData = RootMetaData[];

declare const data: RootData;

export { data };
