// https://vitepress.dev/guide/custom-theme

import { createPinia } from 'pinia';
import TDesign from 'tdesign-vue-next';
import type { Theme } from 'vitepress';

import Layout from '@/AppRoot.vue';
import 'tdesign-vue-next/es/style/index.css';
import '@/styles/_reset.scss';
import '@/styles/_global.scss';

const pinia = createPinia();

export default {
  Layout,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enhanceApp({ app, router, siteData }) {
    app.use(TDesign).use(pinia);
  },
} satisfies Theme;
