export const columnSortMixin = {
  methods: {
    sortByDate(obj1, obj2) {
      let val1 = obj1.deadline
      let val2 = obj2.deadline
      return val1 - val2
    },
  }
}
export const commonMixin = {
  data(){
    return {
      dialogImageVisible: false,
      imageWidth: 350,
      imageHeight: null,
      pendingShowImage: null
    }
  },
  methods: {
    isNull(e) {
      return e === undefined || e === null
    },
    handleImg(url){
      this.dialogImageVisible = true
      this.pendingShowImage = url
      this.imageHeight = 350
    },
    handleImageOnload(){
      console.log(11)
      console.log(this.$refs.imgShow.height)
      console.log(this.$refs.imgShow.width)
      this.imageHeight = this.$refs.imgShow.height/this.$refs.imgShow.width * this.imageWidth
    }
  },
  filters:{
    formatContent(value,filed){
      if(value && value[filed]){
        return value[filed]
      }else{
        return "-"
      }
    },
    formatContentLast(value){
      if(value){
        return value;
      }else {
        return '-';
      }
    },
  }
}