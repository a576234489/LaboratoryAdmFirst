<template>
  <div class="app-wrapper" :class="classObj">
      <side-bar class="sidebar-container"></side-bar>
      <div class="nav-tag">
        <nav-bar></nav-bar>
        <tags-view></tags-view>
      </div>
      <app-main></app-main>
  </div>
</template>

<script>
  import SideBar from 'views/layout/childComps/SideBar'
  import NavBar from 'views/layout/childComps/NavBar'
  import AppMain from 'views/layout/childComps/AppMain'
  import TagsView from 'views/layout/childComps/TagsView'
  import SidebarMixIns from 'common/sideBarMixIns.js'
  export default {
    name: "Layout",
    created() {
      console.log(scroll)
    },
    mixins:[SidebarMixIns],
    computed:{
      sidebar(){
        return this.$store.state.sidebar
      },
      classObj(){
        return{
          hideSideBar: !this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation
        }
      }
    },
    methods:{

    },
    components:{
      SideBar,
      NavBar,
      AppMain,
      TagsView
    }
  }
</script>

<style scoped>
  .app-wrapper{
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .nav-tag {
    margin-left: 210px !important;
  }
  .app-main{
    margin-left: 210px !important;
    transition-duration: 0.3s;
    transform: translate3d(0, 0, 0);
    height: calc(100% - 86px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sidebar-container{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 210px !important;
    overflow: hidden;
    transition-duration: 0.3s;
    transform: translate3d(0, 0, 0);
    z-index: 999;
  }
  .hideSideBar .sidebar-container{
    width: 36px !important;
    transition-duration: 0.3s;
    transform: translate3d(0, 0, 0);
  }
  .hideSideBar .nav-tag{
    margin-left: 36px !important;
    transition-duration: 0.3s;
    transform: translate3d(0, 0, 0);
  }
  .hideSideBar .app-main{
    margin-left: 36px !important;
    transition-duration: 0.3s;
    transform: translate3d(0, 0, 0);
    height: calc(100% - 86px);
  }

</style>
