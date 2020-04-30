export default {
  watch:{
    // $route(route){
    //   console.log(route)
    // }
  },
  beforeMount(){
    window.addEventListener('resize',this.resizeHandler)
  },
  methods:{
    resizeHandler(){
      console.log(111)
    }
  }
}
