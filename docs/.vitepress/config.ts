import { resolve } from 'path';

import { tasklist } from '@mdit/plugin-tasklist';

import { getFileTimeInfo } from './utils';

// https://vitepress.dev/reference/site-config
export default {
  title: "CC's Blog",
  description: 'Share tech and life.',
  base: '/',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
      },
    ],
  ],
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "@/styles/additional.scss" as *;',
        },
      },
    },
  },
  themeConfig: {
    actions: {
      github: 'https://github.com/wengx00',
    },
  },
  markdown: {
    config: (md: any) => {
      md.use(tasklist);
    },
    image: {
      lazyLoading: true,
    },
  },
  async transformPageData(pageData: any) {
    const { relativePath } = pageData;
    return {
      timeInfo: await getFileTimeInfo(resolve(__dirname, '../', relativePath)),
    };
  },
};
