import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Login = ()=>import('views/login')

import Layout from 'views/layout/Layout'

const HomePage = ()=>import('views/homePage/HomePage')

const PlateformAccount = ()=>import('views/plateformAccount/PlateformAccount');
const Role = ()=>import('views/role/Role')
const ResourceCategory = ()=>import('views/resourceCategory/ResourceCategory')
const Resource = ()=>import('views/resource/Resource')
const Menu = ()=>import('views/menu/Menu')

const UserLoginLog = ()=>import('views/userLoginLog/UserLoginLog')
const UserOperationLog = ()=>import('views/userOperationLog/UserOperationLog')

const Equipment = ()=>import('views/equipment/Equipment')

const Banner = ()=>import('views/banner/Banner')

const EquipmentClassification = ()=>import('views/equipmentClassification/EquipmentClassification')

const Notice = ()=>import('views/notice/Notice')

const appUser = ()=>import('views/appUser/AppUser')
const AppOrdinaryUser = ()=>import('views/appUser/AppOrdinaryUser')

const EquipmentMaintain = ()=>import('views/equipmentMaintain/EquipmentMaintain')

const EquipmentAppointment = ()=>import('views/equipmentAppointment/EquipmentAppointment')


const routes = [
  {
    path:'/login',
    component:Login,
    hidden:true
  },
  {
    path:'',
    component:Layout,
    redirect:'/homePage',
    children:[
      {
        path:'homePage',
        name:'/',
        component:HomePage,
        meta:{title:'首页',icon:'dashboard',affix:true},
      }
    ]
  },
  {
    path:'/systemBasic',
    component:Layout,
    meta:{title:'系统基础管理',icon:'list'},
    children:[
      {
        path:'plateformAccount',
        component:PlateformAccount,
        name:'systemBasic',
        meta:{title:'平台账号管理',icon:'home'},
      },
      {
        path:'role',
        component:Role,
        name:'systemBasic',
        meta:{title:'角色管理',icon:'home'},
      },
      {
        path:'resourceCategory',
        component:ResourceCategory,
        name:'systemBasic',
        meta:{title:'资源分类管理',icon:'home'},
      },
      {
        path:'resource',
        component:Resource,
        name:'systemBasic',
        meta:{title:'资源管理',icon:'home'},
      },
      {
        path: 'menu',
        name: 'systemBasic',
        component:Menu,
        meta: {title: '菜单列表', icon: 'ums-menu'}
      },
    ]
  },
  {
    path:'/logInformation',
    component:Layout,
    meta:{title:'日志信息管理',icon:'clipboard'},
    children:[
      {
        path:'userLoginLog',
        component:UserLoginLog,
        name:'logInformation',
        meta:{title:'用户登录日志',icon:'home'},
      },
      {
        path:'userOperationLog',
        component:UserOperationLog,
        name:'logInformation',
        meta:{title:'用户操作日志',icon:'home'},
      }
    ]
  },


]

export const constantRouterMap = [
  {
    path:'/login',
    component:Login,
    hidden:true
  },
  {
    path:'',
    component:Layout,
    redirect:'/homePage',
    children:[
      {
        path:'homePage',
        name:'/',
        component:HomePage,
        meta:{title:'首页',icon:'dashboard',affix:true},
      }
    ]
  },
]

export const asyncRouterMap = [
  {
    path:'/systemBasic',
    component:Layout,
    meta:{title:'系统基础管理',icon:'home'},
    name:'systemBasic',
    children:[
      {
        path:'plateformAccount',
        component:PlateformAccount,
        name:'plateformAccount',
        meta:{title:'平台账号管理',icon:'gen'},
      },
      {
        path:'role',
        component:Role,
        name:'role',
        meta:{title:'角色管理',icon:'gen'},
      },
      {
        path:'resourceCategory',
        component:ResourceCategory,
        name:'resourceCategory',
        meta:{title:'资源分类管理',icon:'gen'},
      },
      {
        path:'resource',
        component:Resource,
        name:'resource',
        meta:{title:'资源管理',icon:'gen'},
      },
      {
        path: 'menu',
        name: 'menu',
        component:Menu,
        meta: {title: '菜单列表', icon: 'gen'}
      },
    ]
  },
  {
    path:'/equipment',
    component:Layout,
    name:'equipment',
    meta:{title:'设备',icon:'equip'},
    children:[
      {
        path:'equipmentManagement',
        component:Equipment,
        name:'equipmentManagement',
        meta:{title:'设备管理',icon:'equip'},
      }
    ]
  },
  {
    path:'/banner',
    component:Layout,
    name:'banner',
    meta:{title:'Banner',icon:'banner'},
    children:[
      {
        path:'bannerManagement',
        component:Banner,
        name:'bannerManagement',
        meta:{title:'Banner图管理',icon:'banner'},
      }
    ]
  },
  {
    path:'/equipmentClassification',
    component:Layout,
    name:'EquipmentClassification',
    meta:{title:'实验室',icon:'lab'},
    children:[
      {
        path:'equipmentClassificationManagement',
        component:EquipmentClassification,
        name:'equipmentClassificationManagement',
        meta:{title:'实验室管理',icon:'lab'},
      }
    ]
  },
  {
    path:'/notice',
    component:Layout,
    name:'notice',
    meta:{title:'公告',icon:'notice'},
    children:[
      {
        path:'noticeManagement',
        component:Notice,
        name:'noticeManagement',
        meta:{title:'公告管理',icon:'notice'},
      }
    ]
  },
  {
    path:'/appUser',
    component:Layout,
    name:'appUser',
    meta:{title:'app账号管理',icon:'user2'},
    children:[
      {
        path:'appUserManagement',
        component:appUser,
        name:'appUserManagement',
        meta:{title:'app管理员账号管理',icon:'gen'},
      },
      {
        path:'appOrdinaryUserManagement',
        component:AppOrdinaryUser,
        name:'appOrdinaryUserManagement',
        meta:{title:'app普通用户管理',icon:'gen'},
      }
    ]
  },
  {
    path:'/equipmentMaintain',
    component:Layout,
    name:'equipmentMaintain',
    meta:{title:'设备维修进度',icon:'appoint'},
    children:[
      {
        path:'equipmentMaintainManagement',
        component:EquipmentMaintain,
        name:'equipmentMaintainManagement',
        meta:{title:'设备维修进度管理',icon:'appoint'},
      }
    ]
  },
  {
    path:'/equipmentAppointment',
    component:Layout,
    name:'equipmentAppointment',
    meta:{title:'设备预约记录',icon:'appoint'},
    children:[
      {
        path:'equipmentAppointmentManagement',
        component:EquipmentAppointment,
        name:'equipmentAppointmentManagement',
        meta:{title:'设备预约记录管理',icon:'appoint'},
      }
    ]
  },
]

const router = new Router({
  routes,
  mode:'history'
})

export default router
