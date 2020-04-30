import {login,fetchGetInfo,logout} from 'network/login'
import {setToken,removeToken} from 'common/auth'
import {asyncRouterMap} from '../router'
export default {
  addVisitedView({commit},view){
    commit('addVisitedView',view)
  },
  delView({commit,state},view){
    return new Promise(resolve => {
      commit('delView',view);
      resolve([...state.visitedViews])
    })
  },
  toggleSideBar({commit}){
    commit('toggleSideBar')
  },
  Login({commit},userInfo){
    let username = userInfo.username.trim();
    return new Promise((resolve,reject) => {
      login(username,userInfo.password).then(res => {
        if(res.code == 200) {
          let data = res.data;
          let tokenStr = data.tokenHead + data.token;
          setToken(tokenStr);
          commit('setToken', tokenStr);
          resolve("登录成功")
        }else{
          reject(res.message)
        }
      }).catch(error => {
        reject("用户名或密码错误")
      })
    })
  },
  getInfo({commit},state){
    return new Promise((resolve,reject)=>{
      fetchGetInfo().then(res => {
        let data = res.data;
        if(data.roles && data.roles.length > 0){
          commit('setRoles',data.roles)
        }else{
          reject('用户的角色不能为空')
        }
        console.log(data)
        commit('setName',data.username);
        commit('setNickName',data.nickName);
        commit('setId',data.id);
        commit('setHeadPortrait',data.icon)
        resolve(res)
      }).catch( err => {
        reject("获取已登录的账号信息失败")
      })
    })
  },
  GenerateRoutes({commit},data){
    return new Promise(resolve => {
      const {menus,username} = data;
      const accessedRoutes = asyncRouterMap.filter(item => {//遍历前端路由
        if(username == 'admin'){
          return item
        }
        if(hasPermission(menus,item)){//true:该角色拥有该前端路由，进行路由参数设置
          if(item.children && item.children.length > 0){
            item.children = item.children.filter(child => {//子路由遍历
              if(hasPermission(menus,child)){
                return child;
              }
              return false;
            })
            return item;
          }else{
            return item;
          }
        }
        return false;
      })
      sortRouters(accessedRoutes);
      commit('setRouters',accessedRoutes)
      resolve(accessedRoutes);
    })
  },
  // 登出
  LogOut({ commit, state }) {
    console.log(12)
    return new Promise((resolve, reject) => {

      logout(state.token).then(() => {
        console.log(11)
        commit('setToken', '')
        commit('setRoles', [])
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}
//判断是否有权限访问该菜单
function hasPermission(menus, route) {//menus后台查询的菜单路由route遍历的每一个前端路由
  if (route.name) {
    let currMenu = getMenu(route.name, menus);//根据前端路由name得到对应的后端路由
    if (currMenu!=null) {
      //设置菜单的标题、图标和可见性
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title;
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta.icon = currMenu.icon;
      }
      if(currMenu.hidden!=null){
        route.hidden = currMenu.hidden !== 0;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    } else {
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true
  }
}
//根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (name===menu.name) {
      return menu;
    }
  }
  return null;
}
//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if(router.children && router.children.length > 0){
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p){
  return function(m,n){
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}


