import { resolve } from 'path';

import { tasklist } from '@mdit/plugin-tasklist';

import { getFileTimeInfo } from './utils';

// https://vitepress.dev/reference/site-config
export default {
  title: "CC's Blog",
  description: 'Share tech and life.',
  lang: 'zh-CN',
  base: '/',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
      },
    ],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'Web,前端,JavaScript,Vue,React,Node.js,TypeScript,开发者,程序员,front-end,developer,programmer,科技,生活,技术,docker,linux,macOS,windows,技术博客,flutter,C++,swiftui,xcode,shell,bash,http,https,tcp,操作系统,数据结构,计算机网络,编译原理',
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
