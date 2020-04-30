import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import {getToken} from 'common/auth'
import {constantRouterMap} from '../router'
Vue.use(Vuex)

const state = {
  sidebar:{//侧滑菜单的滑动监听
    opened: !+Cookies.get('sidebarStatus'),
    withoutAnimation:false,
  },
  visitedViews:[],//tab标签叶
  routes:[],//路由
  token:getToken(),
  roles:[],//角色集合
  headPortrait:'',//头像
  name:'',//用户账户名
  nickName:'',//用户昵称
  id:'',//用户id
  addRouters:[],//根据角色查询出来的菜单路由
  routers: constantRouterMap,
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
export default store
