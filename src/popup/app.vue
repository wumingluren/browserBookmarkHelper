<script setup lang="ts"></script>

<template>
  <header
    aria-label="Site Header"
    class="bg-gray-50 ceshi"
  >
    弹窗头
  </header>

  <RouterView></RouterView>

  <footer
    aria-label="Site Footer"
    class="bg-gray-50"
  >
    弹窗尾部
  </footer>
</template>

<style lang="scss" scoped>
.ceshi {
  color: red;
}
</style>
