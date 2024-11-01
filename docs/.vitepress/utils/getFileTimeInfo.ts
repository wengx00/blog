import callBash from './callBash';
import { tryCatch, dateUtils } from '../../../src/utils';

export default async function getFileTimeInfo(path: string): Promise<{
  createdAt: string | null;
  updatedAt: string | null;
}> {
  const [result, err] = await tryCatch(
    Promise.all([
      callBash<string>(`git log -1 --pretty="%ai" ${path}`),
      callBash<string>(`git log -1 --reverse --pretty="%ai" ${path}`),
    ]),
  );

  if (err || !result) {
    return {
      createdAt: null,
      updatedAt: null,
    };
  }

  const [createdAt, updatedAt] = result;

  return {
    createdAt: dateUtils.getDateTimeString(new Date(createdAt)),
    updatedAt: dateUtils.getDateTimeString(new Date(updatedAt)),
  };
}
