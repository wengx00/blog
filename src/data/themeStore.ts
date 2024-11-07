import { defineStore } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';

export default defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('light');
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

  onMounted(() => {
    document.documentElement.setAttribute('theme-mode', currentTheme.value);
    mediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.value.matches ? 'dark' : 'light');
    mediaQuery.value.addEventListener('change', mediaMatchChangeHandler);
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
});
