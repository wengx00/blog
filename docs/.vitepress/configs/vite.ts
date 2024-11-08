import { resolve } from 'path';

export default {
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
};
