import { tagColor } from '../../src/config';

export default {
  paths() {
    return Object.keys(tagColor.background).map((name) => ({
      params: { name },
    }));
  },
};
