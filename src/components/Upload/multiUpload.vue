<template> 
  <div>
    <el-upload
            :action="useOss?ossUploadUrl:minioUploadUrl"
            :data="useOss?dataObj:null"
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :on-preview="handlePreview"
            :limit="maxCount"
            :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {policy} from 'network/oss'

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      }
    },
    data() {
      return {
        imageArray:this.value,
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: ''
        },
        dialogVisible: false,
        dialogImageUrl:null,
        useOss:false, //使用oss->true;使用MinIO->false
        ossUploadUrl:'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
        minioUploadUrl:'http://120.78.207.225:8234/file/upload',
        //minioUploadUrl:'http://192.168.168.45:8081/file/upload',
      };
    },
    computed: {
      fileList: {
        get(){
          let fileList=[];
          for(let i=0;i<this.imageArray.length;i++){
            fileList.push({url:this.imageArray[i]});
          }
          return fileList;
        },
        set(fileList){
          this.imageArray = fileList
        }
      }
    },
    methods: {
      emitInput(fileList) {
        let value=[];
        for(let i=0;i<fileList.length;i++){
          value.push(fileList[i].url);
        }
        this.$emit('input', value)//改变value的值
      },
      handleRemove(file, fileList) {
        let fileListTemp = []
        fileList.forEach(item => {
          fileListTemp.push(item.url)
        })
        this.fileList = fileListTemp;
        this.emitInput(fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      beforeUpload(file) {
        let _self = this;
        if(!this.useOss){
          //不使用oss不需要获取策略
          return true;
        }
        return new Promise((resolve, reject) => {
          policy().then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + '/${filename}';
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      },
      handleUploadSuccess(res, file) {
        let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
        if(!this.useOss){
          //不使用oss直接获取图片路径
          url = res.data.url;
        }
        this.fileList.push({name: file.name,url:url});//value本身的内容+当前内容
        this.emitInput(this.fileList);
        this.$emit('multiClearValidate')
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
    },
    watch: {
      value(val){
        console.log(val)
        let fileListTemp = []
        val.forEach(item => {
          fileListTemp.push(item)
        })
        this.fileList = fileListTemp;
      }
    }
  }
</script>
<style>

</style>


