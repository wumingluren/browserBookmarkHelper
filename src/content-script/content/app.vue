<template>
  <div
    class="xuanfu"
    style=""
  >
    <!-- v-if="dialogVisible" -->
    <el-dialog
      v-model="dialogVisible"
      title=""
      width="700px"
      :show-close="false"
      :z-index="999999999"
      draggable
      class="dialog"
    >
      <!-- @keyup.enter="handleSearch" -->
      <div class="dialog-content">
        <div class="search">
          <el-input
            v-model="searchVal"
            placeholder="输入搜索词（三个字符以上或者一个汉字以上）"
            ref="inputRef"
            class="Search-input"
            size="large"
            maxlength="50"
            clearable
            :autofocus="true"
            @input="handleSearch"
          ></el-input>
        </div>
        <div class="result">
          <!-- <el-scrollbar max-height="400px"> -->
          <div class="list">
            <!-- <div
                class="list-item"
                v-for="item in searchResultList"
                :key="item.id"
                :class="{ 'list-item-active': selectedId === item.id }"
                :tabindex="0"
                @mouseover="handleMouseOver(item)"
                @mouseout="handleMouseOut(item)"
                @click="handleOpenUrl(item)"
                @keyup.enter="handleOpenUrl(item)"
              >
                <div class="title">{{ item.title }}</div>
                <div class="url">
                  {{ item.url }}
                </div>
              </div> -->
            <RecycleScroller
              class="scroller"
              :items="searchResultList"
              :item-size="60"
              key-field="id"
              v-if="searchResultList.length"
            >
              <template v-slot="{ item }">
                <div
                  class="list-item"
                  :class="{ 'list-item-active': selectedId === item.id }"
                  @mouseover="handleMouseOver(item)"
                  @mouseout="handleMouseOut(item)"
                  @click="handleOpenUrl(item)"
                  @keyup.enter="handleOpenUrl(item)"
                >
                  <div class="list-item-content">
                    <div class="title">{{ item.title }}</div>
                    <div class="url">
                      {{ item.url }}
                    </div>
                  </div>
                </div>
              </template>
            </RecycleScroller>
          </div>
          <!-- </el-scrollbar> -->
        </div>
        <div v-if="searchResultList.length < 1">
          <el-empty description="还没有进行搜索" />
        </div>
        <div class="footer">
          <div class="results">
            共
            {{ Math.max(searchResultList.length - 1, 0) }}
            条数据
          </div>
          <div class="instructions">
            使用 ↑ ↓ 键切换选中， Enter 回车键新标签打开选中项，ESC关闭弹窗
          </div>
        </div>
      </div>
      <template #footer></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { searchBookmarks, filterBookmarks } from '~/utils/utils'
import throttle from 'lodash.throttle'
import { RecycleScroller } from 'vue-virtual-scroller'

const lastKeyPressTime = ref(0)
const doubleClickDelay = 300

const inputRef: Ref<HTMLElement | null> = ref(null)

const dialogVisible = ref(false)

const searchVal = ref('')

const handleKeyPress = (event: KeyboardEvent) => {
  // 双击s
  if (event.key === 's') {
    // 如果事件源是输入框或者文本域，则直接返回，不执行双击逻辑
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      console.log('在输入框内，文本域触发')

      return
    }

    const currentTime = new Date().getTime()
    const timeSinceLastKeyPress = currentTime - lastKeyPressTime.value

    if (timeSinceLastKeyPress <= doubleClickDelay) {
      // alert('你双击了"S"键！')
      console.log('你双击了"S"键！')
      dialogVisible.value = !dialogVisible.value

      searchVal.value = ''
      selectedId.value = ''
      searchResultList.value = []

      setTimeout(() => {
        if (dialogVisible.value) {
          inputRef.value?.focus()
        }
      }, 500)
    }

    lastKeyPressTime.value = currentTime
  }
}

const getBookmarksFromBackground = async (): Promise<any[]> => {
  return new Promise<any[]>((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'getBookmarks' }, (response) => {
      if (response.error) {
        reject(response.error) // 处理错误情况
      } else {
        resolve(response.bookmarks) // 处理正常情况
        console.log('接收后台消息', response.bookmarks)
      }
    })
  })
}

const searchResultList = ref<any[]>([])
const handleSearch = throttle(async () => {
  try {
    const searchTerm = searchVal.value // 搜索关键词

    const alphabetOrSymbolRegex = /[a-zA-Z!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/
    const chineseCharacterRegex = /^[\u4e00-\u9fa5]+$/

    // 三个字母或者数字一个以上的汉字才进行搜索
    if (
      !(
        searchTerm &&
        ((alphabetOrSymbolRegex.test(searchTerm) && searchTerm.length > 3) ||
          (chineseCharacterRegex.test(searchTerm) && searchTerm.length >= 2))
      )
    ) {
      console.log('搜索值为不满足查询条件')
      return
    }

    const bookmarks: any[] = await getBookmarksFromBackground()
    // 在这里可以处理获取到的书签信息

    const searchResults = searchBookmarks(bookmarks, searchTerm)

    searchResults.unshift({
      id: 'search',
      type: 'search',
      title: `搜索 “${searchTerm}”`,
      url: `使用默认搜索引擎搜索`,
      value: searchTerm,
    })

    console.log('搜索结果', searchResults)

    searchResultList.value = searchResults

    selectedId.value = searchResults[0].id

    // const filterResults = filterBookmarks(bookmarks, searchTerm)
    // console.log('搜索过滤结果', filterResults)
  } catch (error) {
    console.error(error)
    console.log('点击按钮获取出错', error)
    // 在这里可以处理错误情况
  }
}, 500)

function handleEnter() {
  // 处理回车事件的逻辑
  console.log('回车执行')
}

const selectedId = ref('')

const handleMouseOver = (val: { id: string }) => {
  selectedId.value = val.id
}

const handleMouseOut = (val: { id: string }) => {
  selectedId.value = val.id
}

const handleOpenUrl = (val: { value: any; type: string; url: string }) => {
  console.log('打开链接')

  if (val.type && val.type === 'search') {
    chrome.runtime.sendMessage(
      { action: 'searchEvent', params: { searchTerm: val.value } },
      (response) => {
        console.log('收到响应:', response)
      }
    )
    return
  }

  chrome.runtime.sendMessage(
    { action: 'openBookmarks', params: { ...val } },
    (response) => {
      console.log('收到响应:', response)
    }
  )
}

const handleKeyDown = (event: { preventDefault: () => void; key: string }) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault() // 只在需要阻止默认行为的情况下调用
  }

  const currentIndex = searchResultList.value.findIndex(
    (item) => item.id === selectedId.value
  )

  if (event.key === 'ArrowUp') {
    // 上键
    const newIndex =
      (currentIndex - 1 + searchResultList.value.length) %
      searchResultList.value.length
    selectedId.value = searchResultList.value[newIndex].id
  } else if (event.key === 'ArrowDown') {
    // 下键
    const newIndex = (currentIndex + 1) % searchResultList.value.length
    selectedId.value = searchResultList.value[newIndex].id
  } else if (event.key === 'Enter') {
    if (selectedId.value) {
      const selectedItem = searchResultList.value.find(
        (item) => item.id === selectedId.value
      )
      console.log('回车执行', selectedItem)

      handleOpenUrl(selectedItem)
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
  document.addEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  margin: 0 auto; // 水平居中
  top: 50%; // 垂直居中
  transform: translateY(-50%);
}

// :deep(.el-dialog .el-dialog__body) {
//   flex: 1;
//   overflow: auto;
// }

:deep(.el-dialog__header),
:deep(.el-dialog__body),
:deep(.el-dialog__footer) {
  padding: 0;
}

:deep(.el-dialog) {
  border-radius: 5px;
  overflow: hidden;
}
.dialog {
  // border-radius: 10px;
  // overflow: hidden;
}
.dialog-content {
  width: 100%;
  // max-height: 500px;
  min-height: 200px;
  position: relative;
}
.search {
  position: sticky;
  // display: block;
  padding: 5px;
  box-sizing: border-box;
}
.result {
  // max-height: 500px;
  overflow-y: auto;
}
.scroller {
  width: 100%;
  max-height: 400px;
}
.scroller::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

// 滚动条背景
.scroller::-webkit-scrollbar-track {
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 10px;
}

// 滚动条前景
.scroller::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.5);
  border-radius: 4px;
}

// 滚动条前景 hover
.scroller::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.9);
}
.list {
  text-align: center;
  .list-item {
    width: 100%;
    height: 60px;
    padding: 5px 0px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .list-item-content {
    width: auto;
    height: 100%;
    // padding: 0px 10px;
    margin: 0 10px;
    box-sizing: border-box;
    border: 1px solid #eeeeee;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    align-content: space-around;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .title {
    width: 100%;
  }
  .url {
    width: 100%;
  }

  .list-item-active {
    font-size: 16px;
    font-weight: bold;
    background-color: #f0f0f0;
  }
}

.footer {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  position: sticky;
  top: 100%;
  .results {
  }
  .instructions {
  }
}
</style>
