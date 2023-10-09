<template>
  <!-- <header
    aria-label="Site Header"
    class="bg-gray-50"
  >
    Content Script Iframe 头
  </header>

  <RouterView></RouterView>

  <footer
    aria-label="Site Footer"
    class="bg-gray-50"
  >
    Content Script Iframe 尾
  </footer> -->
  <div class="cela">
    内容

    <el-button type="primary">Primary</el-button>
  </div>
</template>
<!-- <script lang="ts">
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'

export default defineComponent({
  components: {
    ElConfigProvider,
  },
})
</script> -->
<script setup lang="ts"></script>

<style lang="scss" scoped>
.cela {
  // width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  padding: 10px;
  // background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px;
  font-size: 60px;
  color: gold;
  pointer-events: auto;
}
</style>
