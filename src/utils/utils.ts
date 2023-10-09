/**
 * 在书签对象列表中搜索符合搜索关键词的书签。
 *
 * @param {Array} bookmarks - 书签对象数组
 * @param {string} searchTerm - 搜索关键词
 * @returns {Array} - 匹配搜索关键词的书签列表
 */
export function searchBookmarks(bookmarks: any[], searchTerm: string): any[] {
  const titleResults: any[] = [] // 名称包含搜索关键词的书签结果列表
  const urlResults: any[] = [] // URL 包含搜索关键词的书签结果列表
  const bookmarkMap: { [id: string]: boolean } = {} // 用于存储已添加的书签ID

  // 判断书签是否与搜索关键词匹配的辅助函数
  const isBookmarkMatch = (bookmark: any, searchTerm: string): boolean => {
    return (
      bookmark.title.includes(searchTerm) || bookmark.url.includes(searchTerm)
    )
  }

  // 将符合条件的书签添加到结果列表的辅助函数
  const addToResults = (results: any[], bookmark: any) => {
    // 检查该书签的ID是否已经存在于 bookmarkMap 中
    if (!bookmarkMap[bookmark.id]) {
      // 如果不存在，则将该书签添加到结果列表中
      results.push(bookmark)
      // 将该书签的ID添加到 bookmarkMap 中，表示已经添加过该书签
      bookmarkMap[bookmark.id] = true
    }
  }

  // 递归搜索书签的函数
  const search = (bookmarks: any[], searchTerm: string) => {
    bookmarks.forEach((bookmark) => {
      // 如果该书签有子节点，则递归调用 search 函数进行子节点的搜索
      if (bookmark.children && bookmark.children.length > 0) {
        search(bookmark.children, searchTerm)
      }

      // 如果该书签的标题和URL都存在，并且与搜索关键词匹配，则调用 addToResults 函数将书签添加到结果列表中
      if (
        bookmark.title &&
        bookmark.url &&
        isBookmarkMatch(bookmark, searchTerm)
      ) {
        addToResults(titleResults, bookmark)
        addToResults(urlResults, bookmark)
      }
    })
  }

  search(bookmarks, searchTerm)

  // 将名称包含搜索关键词的书签结果放在 URL 包含搜索关键词的书签结果之前
  const results = [...titleResults, ...urlResults]

  return results
}
/**
 * 使用示例：
 *
 * const bookmarks = bookmarks; // 书签列表
 * const searchTerm = "example"; // 搜索关键词
 * const searchResults = searchBookmarks(bookmarks, searchTerm);
 * console.log(searchResults); // 打印匹配搜索关键词的书签列表
 */

/**
 * 在书签对象列表中搜索符合搜索关键词的书签。
 *
 * @param {Array} bookmarks - 要过滤的书签对象。
 * @param {string} searchTerm - 搜索词。
 * @returns {Array} - 过滤后的书签书签列表。
 */
export function filterBookmarks(bookmarks: any[], searchTerm: string): any[] {
  return bookmarks.reduce((filtered: any[], bookmark: any) => {
    // 如果书签具有标题和URL属性，并且包含搜索词，则将其添加到过滤后的数组中。
    if (bookmark.title && bookmark.url) {
      if (
        bookmark.title.includes(searchTerm) ||
        bookmark.url.includes(searchTerm)
      ) {
        // console.log('====================================')
        // console.log('包含搜索过滤结果', bookmark)
        // console.log('====================================')
        filtered.push(bookmark)
      }
    }

    // 如果书签具有children属性并且children数组长度大于0，则递归调用该函数进行进一步的过滤。
    if (bookmark.children && bookmark.children.length > 0) {
      const filteredChildren = filterBookmarks(bookmark.children, searchTerm)
      if (filteredChildren.length > 0) {
        // 将过滤后的子项数组添加到过滤后的数组中。
        filtered.push({
          ...bookmark,
          children: filteredChildren,
        })
      }
    }

    return filtered
  }, [])
}
