<template>
  <div class="safe-bottom"></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.safe-bottom {
  display: block;
  flex-shrink: 0;
  width: 100%;
  height: 0px;
  height: const(safe-area-inset-bottom, 0px);
  height: env(safe-area-inset-bottom, 0px);
}
</style>
