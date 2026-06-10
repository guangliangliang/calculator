<script setup>
</script>

<template>
  <view id="app">
  </view>
</template>

<style>
@import url('@/static/css/common.css');

page {
  background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  height: 100vh;
}

#app {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

/* 禁用 uni-app 相关容器的滚动 */
uni-app,
uni-page,
uni-page-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
