import { resolve } from 'path';

import { getFileTimeInfo } from '../utils';

export default async function transformPageData(pageData: any) {
  const { relativePath } = pageData;
  return {
    timeInfo: await getFileTimeInfo(resolve(__dirname, '../../', relativePath)),
  };
}
