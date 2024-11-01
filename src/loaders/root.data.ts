import { createContentLoader } from 'vitepress';

export default createContentLoader('**/*.md');

export interface RootData {}

declare const data: RootData;

export { data };
