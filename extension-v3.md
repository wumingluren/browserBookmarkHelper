# vite-vue3-chrome-extension-v3

[![build](https://github.com/mubaidr/vite-vue3-chrome-extension-v3/actions/workflows/build.yml/badge.svg)](https://github.com/mubaidr/vite-vue3-chrome-extension-v3/actions/workflows/build.yml) [![release](https://github.com/mubaidr/vite-vue3-chrome-extension-v3/actions/workflows/release.yml/badge.svg)](https://github.com/mubaidr/vite-vue3-chrome-extension-v3/actions/workflows/release.yml)

一个使用[Vite](https://vitejs.dev/)构建的WebExtension（Chrome、FireFox等）起始模板。

## 功能

- Vue 3 - 组合式 API、`<script setup>`等。
- Content Script中的Vue 3应用程序（已添加模板）。
- 对扩展页面和Content Script进行热模块替换（HMR）。
- 使用Tailwind CSS进行UI开发。
- 集成Vue Router，包括`vite-plugin-pages`用于自动路由注册。
- 通过[`webext-bridge`](https://github.com/zikaari/webext-bridge)和[VueUse](https://github.com/antfu/vueuse)存储实现简化的通信。
- [组件自动导入](./src/components)。
- [图标](./src/components) - 直接访问来自任何图标集的图标。
- 默认启用[Material Design Icons](https://materialdesignicons.com/cdn/1.6.50-dev/)。
- [TypeScript](https://www.typescriptlang.org/) - 类型安全。
- 使用`Eslint`和`Prettier`进行`vue`、`javascript`、`typescript`的代码风格检查。
- 基于[Vite](https://crxjs.dev/vite-plugin)构建Chrome扩展的CRXJS Vite插件。
- 集成了Github的构建和发布工作流。

*如果您觉得某些功能缺失或有改进的空间，请提出问题。*

## 预装插件

### WebExtension Libraries

- [`webext-bridge`](https://github.com/zikaari/webext-bridge) - 不同上下文之间的无缝通信

### Vite 插件

- [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) - 基于文件系统的路由生成器
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - 直接使用`browser`和Vue组合式API而无需导入
- [`unplugin-vue-components`](https://github.com/antfu/vite-plugin-components) - 组件自动导入
- [`unplugin-icons`](https://github.com/antfu/unplugin-icons) - 图标作为组件
- [Material Design Icons](https://icon-sets.iconify.design/mdi/) - Material Design 图标

### Vue 插件

- [VueUse](https://github.com/antfu/vueuse) - 一组有用的组合式API

### UI 框架

- [tailwindcss](https://tailwindcss.com) - 一个实用的CSS框架

### 编码风格

- 使用组合式API和[`<script setup>` SFC语法](https://github.com/vuejs/rfcs/pull/227)

## 使用模板

### GitHub 模板

[从GitHub上的模板创建仓库](https://github.com/mubaidr/vite-vue3-chrome-extension-v3/generate)。

### 克隆到本地

如果您更喜欢手动操作，并且希望有更简洁的Git历史记录

> 如果您没有安装pnpm，请运行：npm install -g pnpm

```bash
pnpx degit mubaidr/vite-vue3-chrome-extension-v3 my-webext
cd my-webext
pnpm i
```
使用方法：

### 文件夹

- `src` - 主要的源代码。
- `content-script` - 要作为 `content_script` 注入的脚本和组件。
- `iframe` - 将被注入到页面中的内容脚本的 Vue 3 应用程序。
- `background` - 后台脚本。
- `popup` - 弹出式 Vue.js 应用程序的根目录。
- `pages` - 弹出式页面。
- `options` - 选项 Vue.js 应用程序的根目录。
- `pages` - 选项页面。
- `pages` - 应用程序页面，适用于所有视图（关于、联系、认证等）。
- `components` - 自动导入的在弹出式和选项页面中共享的 Vue 组件。
- `assets` - 在 Vue 组件中使用的资源文件。
- `dist` - 构建后的文件，也作为开发环境中 Vite 的存根入口。

### 开发

```bash
pnpm dev
```
然后使用 `dist/` 文件夹加载扩展程序到浏览器。

### 构建

要构建扩展程序，请运行以下命令：

```bash
pnpm build
```

然后打包 `dist` 文件夹中的文件，您可以将 `dist.crx` 或 `dist.xpi` 上传到相应的扩展商店。

## 鸣谢

该模板受到以下项目的启发：https://github.com/antfu/vitesse-webext