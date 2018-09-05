// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'

Vue.use(MintUI)

Vue.config.productionTip = false

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /.(vue|js)$/
)
console.log(requireComponent.keys())
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
  console.log(fileName)
  console.log(componentName)

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
