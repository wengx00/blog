import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';

export default defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('light');

  const setTheme = (theme: 'light' | 'dark') => {
    console.log(theme);
    currentTheme.value = theme;
    document.documentElement.setAttribute('theme-mode', theme);
  };

  onMounted(() => {
    document.documentElement.setAttribute('theme-mode', currentTheme.value);
  });

  return {
    currentTheme,
    setTheme,
  };
});
