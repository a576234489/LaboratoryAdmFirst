<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!--<keep-alive>-->
        <router-view :key="key" />
      <!--</keep-alive>-->
    </transition>
  </section>
</template>

<script>
  export default {
    name: "AppMain",
    computed:{
      key() {
        return this.$route.path
      }
    }
  }
</script>

<style scoped>
  .app-main{
    height: calc(100% - 50px - 34px);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  /* breadcrumb transition */
  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: all .5s;
  }

  .breadcrumb-enter,
  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }

  .breadcrumb-move {
    transition: all .5s;
  }

  .breadcrumb-leave-active {
    position: absolute;
  }

</style>
