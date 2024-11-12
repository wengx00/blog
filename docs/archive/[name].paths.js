import { TagEnum } from '../../src/config';

export default {
  paths() {
    return Object.values(TagEnum).map((name) => ({
      params: { name },
    }));
  },
};
