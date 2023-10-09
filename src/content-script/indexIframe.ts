// import './indexIframe.scss'

// // 获取iframe的源文件URL
// const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

// // 使用DOMParser创建一个iframe元素，并设置src属性为获取到的URL
// const iframe = new DOMParser().parseFromString(
//   `<iframe class="crx-iframe" src="${src}"></iframe>`,
//   'text/html'
// ).body.firstElementChild

// // 检查iframe是否存在，并将其添加到页面的body中
// if (iframe) {
//   document.body?.append(iframe)
// }
