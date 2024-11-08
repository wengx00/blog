import {
  basic,
  head,
  markdown,
  themeConfig,
  transformPageData,
  vite,
} from './configs';

// https://vitepress.dev/reference/site-config
export default {
  ...basic,
  head,
  vite,
  markdown,
  themeConfig,
  transformPageData,
};
