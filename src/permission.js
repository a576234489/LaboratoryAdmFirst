import router from './router'
import {getToken} from "./common/auth";
import store from './store'

const whiteList = ['/login']
router.beforeEach((to,from,next)=>{
  if(getToken()){
    if(to.path == '/login'){
      next({path:"/"})
    }else{
      if(store.getters.roles.length == 0){
        store.dispatch('getInfo').then(res =>{
          let menus = res.data.menus;
          let username = res.data.username;
          store.dispatch('GenerateRoutes',{menus,username}).then(res => {
            router.addRoutes(store.getters.addRouters);//动态添加可访问路由表
            //console.log(...to)
            next({...to,replace:true})
          })
        }).catch(err =>{
          console.log(err);
        })
      }else{
        next();
      }
    }
  }else{
    if(whiteList.indexOf(to.path) !== -1){//要跳转的路径在白名单中存在
      next();
    }else{//不存在
      next('/login')
    }
  }
})
