<script setup lang="ts">
// chrome.identity.launchWebAuthFlow(
//   {
//     interactive: true,
//     url:
//       `https://github.com/login/oauth/authorize` +
//       `?client_id=55e294602d71eb006dc505540cf0614d6b3c7f35` +
//       `&redirect_uri=https://ekgmcbpgglflmgcfajnglpbcbdccnnje.chromiumapp.org/github_cb` +
//       `&scope=user.email`,
//   },
//   (a) => {
//     console.log(a)
//   }
// )
// 封装获取书签数据的方法
function getBookmarks(): Promise<any[]> | never {
  console.log(chrome.bookmarks, 'xxxxxxxxxxxxxxxxxxxxxx', chrome)
  // 检查浏览器是否支持书签管理API
  if (typeof chrome !== 'undefined' && (chrome as any).bookmarks) {
    console.log('xxxxxxxxxxxxxxxxxxxxxx')

    // 使用Chrome书签管理API
    return new Promise((resolve, reject) => {
      ;(chrome as any).bookmarks.getTree(function (bookmarkTreeNodes: any[]) {
        return resolve(bookmarkTreeNodes)
      })
    })
  }
  // ts 爆红 browser 找不到
  // else if (typeof browser !== 'undefined' && (browser as any).bookmarks) {
  //   // 使用Firefox书签管理API
  //   return Promise.resolve((browser as any).bookmarks.getTree());
  // }
  else {
    // 浏览器不支持书签管理API，抛出异常
    return Promise.reject('浏览器不支持书签管理API')
  }
}

onMounted(() => {
  //调用获取书签数据的方法
  // getBookmarks()
  //   .then(function (bookmarks: any[]) {
  //     // 在这里处理书签数据
  //     console.log(bookmarks)
  //   })
  //   .catch(function (error: Error) {
  //     // 处理异常情况
  //     console.error(error)
  //   })
})
</script>

<template>
  <div class="text-center m-4">
    <h1 class="text-3xl font-bold underline pb-6">这是弹窗!</h1>

    <RouterLink to="/about">关于</RouterLink>
  </div>
</template>

<style scoped>
.logo {
  height: 6rem;
  padding: 1.5rem;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
