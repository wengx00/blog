import TagEnum from './tagEnum';

export interface TagColor {
  text: Record<TagEnum, string>;
  background: Record<TagEnum, string>;
}

export default {
  text: {
    [TagEnum.UNTAG]: 'var(--td-text-color-primary)',
    [TagEnum.BLOG]: 'var(--td-text-color-anti)',
  } as Record<string, string>,
  background: {
    [TagEnum.UNTAG]: 'var(--td-bg-color-component)',
    [TagEnum.BLOG]: 'var(--td-brand-color)',
  } as Record<string, string>,
} as TagColor;
