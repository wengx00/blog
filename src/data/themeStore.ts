import { defineStore } from 'pinia';
import { onBeforeMount, onUnmounted, ref } from 'vue';

export default defineStore(
  'theme',
  () => {
    const currentTheme = ref<'light' | 'dark'>();
    const mediaQuery = ref<MediaQueryList>();

    const setTheme = (theme: 'light' | 'dark') => {
      currentTheme.value = theme;
      document.documentElement.setAttribute('theme-mode', theme);
    };

    const mediaMatchChangeHandler = (event: MediaQueryListEvent) => {
      const { matches } = event;
      if (matches === (currentTheme.value === 'dark')) {
        return;
      }
      setTheme(matches ? 'dark' : 'light');
    };

    onBeforeMount(() => {
      mediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.value.addEventListener('change', mediaMatchChangeHandler);
      if (currentTheme.value) {
        // 有缓存
        document.documentElement.setAttribute('theme-mode', currentTheme.value);
        return;
      } 
      // 没缓存的情况下根据主题设置
      setTheme(mediaQuery.value.matches ? 'dark' : 'light');
    });

    onUnmounted(() => {
      if (mediaQuery.value) {
        mediaQuery.value.removeEventListener('change', mediaMatchChangeHandler);
      }
    });

    return {
      currentTheme,
      setTheme,
    };
  },
  {
    persist: {
      pick: ['currentTheme'],
    },
  },
);
