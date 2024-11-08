import { tasklist } from '@mdit/plugin-tasklist';

export default {
  config: (md: any) => {
    md.use(tasklist);
  },
  image: {
    lazyLoading: true,
  },
};
