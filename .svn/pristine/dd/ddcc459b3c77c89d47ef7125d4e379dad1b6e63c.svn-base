<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :to="{ path: tag.path}"
        class="tags-view-item"
        :class="isActive(tag)?'active':''"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></span>
      </router-link>
    </div>
  </div>
</template>

<script>
  import path from 'path'
  export default {
    name: "TagsView",
    computed:{
      visitedViews(){
        return this.$store.state.visitedViews;
      },
      routes(){
        return this.$router.options.routes
      }
    },
    mounted(){
      this.initTags();
      this.addTags()
    },
    methods:{
      isActive(route){
        return route.path === this.$route.path;
      },
      //获取route.meta.affix=true,拼接路由全路径，初始化首页,无关闭标识
      fiterAffixTags(routes,basePath="/"){
        let tags = []
        routes.forEach(route => {
          if(route.meta && route.meta.affix){
            const tagPath = path.resolve(basePath,route.path);
            tags.push({
              fullPath:tagPath,
              path:tagPath,
              name:route.name,
              meta:{...route.meta}
            })
          }
          if(route.children){
            const tempTags = this.fiterAffixTags(route.children,route.path);
            if(tempTags.length >= 1){//父路由子路由合并
              tags = [...tags,...tempTags]
            }
          }
        })
        return tags
      },
      initTags(){
        const affixTags = this.affixTags = this.fiterAffixTags(this.routes);
        for(const tag of affixTags){
          if(tag.name){
            this.$store.dispatch('addVisitedView',tag)
          }
        }
      },
      //子路由才被加到标签页中,根据name属性判断
      addTags(){
        const {name} = this.$route;
        if(name){
          this.$store.dispatch('addVisitedView',this.$route)
        }
      },
      closeSelectedTag(view){
        this.$store.dispatch('delView',view).then(visitedViews => {
          if(this.isActive(view)){
            this.toLastView(visitedViews,view)
          }
        })
      },
      toLastView(visitedViews,view){
        const latestView = visitedViews.slice(-1)[0];//获取数组的最后一个元素
        if(latestView){
          this.$router.push(latestView.fullPath)
        }else{
          this.$router.push('/')
        }
      },
      //根据路由mata中的affix判断是否隐藏关闭符号
      isAffix(tag){
        return tag.meta && tag.meta.affix
      }
    },
    watch:{
      //监听路由的变化
      $route(){
        this.addTags();
      }
    }
  }
</script>

<style scoped>
  .tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  }
  .tags-view-item{
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    color: #495060;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;
  }
  .active{
    background-color: #42b983;
    color: #fff;
    border-color: #42b983;
  }
  .active::before{
    content: '';
    background: #fff;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    margin-right: 2px;
  }
  .el-icon-close{
    width: 16px;
    height: 16px;
    vertical-align: 2px;
    border-radius: 50%;
    text-align: center;
  }
  .el-icon-close::before{
    display: inline-block;
    vertical-align: -3px;
  }
  .el-icon-close:hover{
    background-color: #b4bccc;
    color: #fff;
  }
</style>
