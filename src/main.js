import Vue from 'vue'
import App from './App.vue'

// 路由组价
import router from './router'
// vuex组件
import store from './store'
// element-ui插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
// svg-icon
import '@/icons'

import 'assets/css/globel.css'
//导入permission.js
import '@/permission'
Vue.use(ElementUI,{locale})
// Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
