<template>
   <div ref="wrapper">
     <div class="content">
       <slot></slot>
     </div>
   </div>
</template>

<script>
  import Scroll from 'better-scroll'
  export default {
    name: "scroll",
    data(){
      return{
        scroll:null
      }
    },
    props:{
      probeType:{
        type:Number,
        default() {
          return 0;
        }
      },
      pullUpLoad:{
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    mounted(){
      this.scroll = new Scroll(this.$refs.wrapper,{
        click:true,
        probeType:this.probeType,
        pullUpLoad:this.pullUpLoad
      });
      this.scroll.on('scroll',position=>{
        this.$emit('scroll',position);
      });
      this.scroll.on('pullingUp',()=>{
        this.$emit('pullingUp')
      });
    },
    methods:{
      scrollTo(x,y,time=300){
        this.scroll&&this.scroll.scrollTo(x,y,300);
      },
      scrollFinish(){
        this.scroll&&this.scroll.finishPullUp()
      },
      refresh(){
        this.scroll&&this.scroll.refresh();
      },
      getScrollY(){
        return this.scroll.y;
      }
    }
  }
</script>

<style scoped>

</style>
