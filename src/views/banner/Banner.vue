<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
              :data="list"
              style="width: 100%;"
              v-loading="listLoading" border
      >
        <el-table-column label="编号" width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="轮播图"  align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.url"></template>
        </el-table-column>
        <el-table-column label="排序" align="center" width="80px">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
            :title="isEdit?'添加Banner图':'编辑Banner图'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%"
    >
      <el-form :model="bannerData"
               label-width="208px" size="small"
               ref="bannerForm"
               :rules="rules"
      >
        <el-form-item label="轮播图：" prop="url">
          <single-upload v-model="bannerData.url"
                         style="width: 300px;display: inline-block;margin-left: 10px"
                         @singleClearValidate = "singleClearValidate"
          >
          </single-upload>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="bannerData.sort" style="width: 250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('bannerForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchListAll,fetchCreate,fetchUpdate,fetchDelete} from 'network/banner';
  import SingleUpload from 'components/Upload/singleUpload'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  const defaultBannerData={
    id:null,
    url:null,
    sort:0
  };
  export default {
    name: "Banner",
    data() {
      return {
        list: null,
        listLoading: false,
        dialogEditVisible:false,
        bannerData:JSON.parse(JSON.stringify(defaultBannerData)),
        isEdit:false,
        rules: {
          url: [{required: true, message: 'Banner图不能为空', trigger: 'blur'}],
          sort: [
            {required: true, message: '请输入排序值', trigger: 'blur'}
          ],
        },
      }
    },
    created() {
      this.getList();
    },
    mixins: [columnSortMixin,commonMixin],
    methods:{
      getList() {
        this.listLoading = true;
        fetchListAll().then(res => {
          this.listLoading = false;
          this.list = res.data;
        });
      },
      singleClearValidate(){
        this.$refs['bannerForm'].clearValidate('url');
      },
      handleUpdate(index,row){
        this.isEdit = false;
        this.dialogEditVisible = true;
        this.bannerData = Object.assign({},row);
        try{
          this.$refs['bannerForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该banner图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          });
        });
      },
      handleDialogConfirmResult(res){
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: 'success',
          });
          this.dialogEditVisible = false;
          this.getList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
      handleAdd() {
        this.isEdit = true;
        this.dialogEditVisible = true;
        this.bannerData = JSON.parse(JSON.stringify(defaultBannerData));
        try{
          this.$refs['bannerForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDialogConfirm(ref) {
        this.$refs[ref].validate((valid) => {
          if(valid){
            this.$confirm('是否要确认?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.bannerData.id != null) {
                fetchUpdate(this.bannerData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              } else {
                fetchCreate(this.bannerData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              }
            })
          }else{
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      handleDialogConfirmResult(res){
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: 'success',
          });
          this.dialogEditVisible = false;
          this.getList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
    },
    components:{
      SingleUpload
    }
  }
</script>

<style scoped>
  .operate-container{
    margin-top: 20px;
  }
  .operate-container .btn-add{
    float: right;
  }
  .app-container{
    padding: 25px;
  }
</style>