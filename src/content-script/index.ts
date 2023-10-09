import { createApp } from 'vue'
import App from './content/app.vue'
import './index.scss'
import "vue-virtual-scroller/dist/vue-virtual-scroller.css" // 引入它的 css

const container = document.createElement('div')
container.id = 'wm-crx-bm'
container.className = 'wm-crx-bm'

const root = document.createElement('div')
root.id = 'wm-crx-bm-app'
root.className = 'wm-crx-bm-app'

container.appendChild(root)

// 将容器添加到文档的 body 元素中
document.body.appendChild(container)

// 创建 Vue 应用
const app = createApp(App)

console.log('创建注入vue', app)

// 在 Vue 应用的全局属性中添加一个名为 $app 的对象，用于存储上下文信息
app.config.globalProperties.$app = {
  context: '',
}

// 在 Vue 应用中提供对 $app 对象的访问，以便在脚本设置中使用 const app = inject('app')
app.provide('app', app.config.globalProperties.$app)

// 将 Vue 应用挂载到根元素上
app.mount(root)
