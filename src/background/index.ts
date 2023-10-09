chrome.runtime.onInstalled.addListener(async (opt) => {
  if (opt.reason === 'install') {
    await chrome.storage.local.clear()

    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('./installed.html'),
    })
  }
})

// chrome.contextMenus.create({
//   id: 'unique_menu_id',
//   title: '书签按钮',
//   contexts: ['page'],
//   onclick: function () {
//     alert('您点击了右键菜单！')
//   },
// })

chrome.contextMenus.create({
  id: 'unique_menu_id',
  title: '书签按钮',
  contexts: ['page'],
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'unique_menu_id') {
    console.log('您点击了右键菜单！')
  }
})

// 封装获取书签数据的方法
function getBookmarks(): Promise<{ bookmarkTreeNodes: any[] }> {
  console.log(chrome.bookmarks, '后台js', chrome)
  // 检查浏览器是否支持书签管理API
  if (typeof chrome !== 'undefined' && (chrome as any).bookmarks) {
    // 使用Chrome书签管理API
    return new Promise((resolve, reject) => {
      ;(chrome as any).bookmarks.getTree(function (bookmarkTreeNodes: any[]) {
        console.log(bookmarkTreeNodes) // 打印书签树状结构数据
        resolve({ bookmarkTreeNodes })
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

// 封装执行获取书签并发送响应的方法
const fetchBookmarksAndSendResponse = (sendResponse: {
  (response?: any): void
  (arg0: { bookmarks: chrome.bookmarks.BookmarkTreeNode }): void
}) => {
  chrome.bookmarks.getTree(
    (bookmarkTreeNodes: chrome.bookmarks.BookmarkTreeNode[]) => {
      // 将书签信息作为响应发送给内容脚本
      sendResponse({ bookmarks: bookmarkTreeNodes })
      console.log('====================================')
      console.log('背景发回消息')
      console.log('====================================')
    }
  )
}

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBookmarks') {
    // 执行获取书签的方法
    getBookmarks()
      .then((response) => {
        // 将书签信息作为响应发送给内容脚本
        sendResponse({ bookmarks: response.bookmarkTreeNodes })
      })
      .catch((error) => {
        // 处理获取书签时的错误，并将错误信息作为响应发送给内容脚本
        sendResponse({ error: error })
      })

    // 返回 true 表示异步发送响应
    return true
  }
})

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openBookmarks') {
    chrome.tabs.create({ url: request.params.url })
  }
})

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchEvent') {
    // 新选项卡打开搜索
    chrome.search.query({
      text: request.params.searchTerm,
      disposition: 'NEW_TAB',
    })
  }
})

console.log('background 后台运行')

export {}
