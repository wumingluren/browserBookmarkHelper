import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { dirname, relative } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import manifest from './manifest.config'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    crx({ manifest }),

    vue(),

    // 应用 Pages 插件并配置页面目录和基本路由
    Pages({
      dirs: [
        {
          dir: 'src/pages',
          baseRoute: '',
        },
        {
          dir: 'src/options/pages',
          baseRoute: 'options',
        },
        {
          dir: 'src/popup/pages',
          baseRoute: 'popup',
        },
        {
          dir: 'src/content-script/iframe/pages',
          baseRoute: 'iframe',
        },
        // {
        //   dir: 'src/content-script/content/pages',
        //   baseRoute: 'content',
        // },
      ],
    }),

    // 应用 AutoImport 插件并配置导入项和类型声明文件路径
    AutoImport({
      imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables/'],
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/unplugin-vue-components
    // 组件配置
    Components({
      // 组件目录
      dirs: ['src/components'],
      // 用于生成 TypeScript 的声明文件
      dts: 'src/components.d.ts',
      // 解析器配置
      resolvers: [
        // 自动导入图标
        IconsResolver({
          // 图标的前缀
          prefix: 'i',
          // 启用的图标集合
          enabledCollections: ['mdi'],
        }),
        ElementPlusResolver(),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
      compiler: 'vue3',
      scale: 1.5,
    }),

    // 资源路径重写配置
    {
      // 插件名称
      name: 'assets-rewrite',
      // 强制在构建之后执行
      enforce: 'post',
      // 应用于构建过程
      apply: 'build',
      // 转换 index.html 文件的回调函数
      transformIndexHtml(html, { path }) {
        // 使用正则表达式替换资源路径
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`
        )
      },
    },
  ],
  build: {
    // Rollup 选项
    rollupOptions: {
      // 输入配置
      input: {
        // iframe 入口文件路径
        iframe: 'src/content-script/iframe/index.html',
        options: 'src/options/index.html',
        popup: 'src/popup/index.html',
        // content: 'src/content-script/content.html',
      },
    },
  },
  server: {
    port: 8888,
    strictPort: true,
    hmr: {
      port: 8889,
      overlay: false,
    },
  },
  // 优化依赖项配置
  optimizeDeps: {
    // 包含的依赖项
    include: ['vue', '@vueuse/core'],
    // 排除的依赖项
    exclude: ['vue-demi'],
  },
})
