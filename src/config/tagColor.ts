import TagEnum from './tagEnum';

export interface TagColor {
  text: Record<TagEnum, string>;
  background: Record<TagEnum, string>;
}

export default {
  text: {
    [TagEnum.BLOG]: 'var(--td-text-color-anti)',
    [TagEnum.WEB_FE]: 'var(--td-text-color-anti)',
    [TagEnum.NETWORK]: 'var(--td-text-color-anti)',
    [TagEnum.NODEJS]: 'var(--td-text-color-anti)',
    [TagEnum.UNTAG]: 'var(--td-text-color-primary)',
  } as Record<string, string>,
  background: {
    [TagEnum.BLOG]: 'var(--td-brand-color)',
    [TagEnum.WEB_FE]: 'var(--td-success-color)',
    [TagEnum.NETWORK]: 'var(--td-warning-color)',
    [TagEnum.NODEJS]: 'var(--td-error-color)',
    [TagEnum.UNTAG]: 'var(--td-bg-color-component)',
  } as Record<string, string>,
} as TagColor;
