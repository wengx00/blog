export default {
  getDateTimeString(
    date: Date,
    options?: {
      divider?: string;
      ms?: boolean;
      second?: boolean;
      minute?: boolean;
      hour?: boolean;
      day?: boolean;
      month?: boolean;
      year?: boolean;
    },
  ) {
    const pad = (str: string | number) => `0${str}`.slice(-2);
    const {
      divider = '/',
      year = true,
      month = true,
      day = true,
      hour = true,
      minute = true,
      second = true,
      ms = false,
    } = options || {};
    const part1 = [
      year && date.getFullYear(),
      month && pad(date.getMonth() + 1),
      day && pad(date.getDate()),
    ]
      .filter(Boolean)
      .join(divider);

    const part2 = [
      hour && pad(date.getHours()),
      minute && pad(date.getMinutes()),
      second && pad(date.getSeconds()),
      ms && pad(date.getMilliseconds()),
    ]
      .filter(Boolean)
      .join(':');

    if (part2) {
      return `${part1} ${part2}`;
    }
    return part1;
  },
};
