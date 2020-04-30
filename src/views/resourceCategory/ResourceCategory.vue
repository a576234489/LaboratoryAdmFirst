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
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="排序" align="center" :sortable="true" :sort-method="sortByDate">
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
            :title="isEdit?'编辑资源分类':'添加资源分类'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%">
      <el-form :model="ResourceCategoryData"
               label-width="208px" size="small"
               ref="resourceCategoryForm"
               :rules="rules"
      >
        <el-form-item label="名称：" prop="name">
          <el-input placeholder="请输入名称" v-model="ResourceCategoryData.name" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input placeholder="请输入排序值" v-model="ResourceCategoryData.sort" style="width: 250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('resourceCategoryForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchListAll,fetchCreate,fetchUpdate,fetchDelete} from 'network/resouceCategory';
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultResourceCategoryData={
    name:null,
    sort:0
  };
  export default {
    name: 'ResourceCategory',
    data() {
      return {
        list: null,
        listLoading: false,
        dialogEditVisible:false,
        ResourceCategoryData:Object.assign({},defaultResourceCategoryData),
        rules: {
          name: [{required: true, message: '请输入资源分类', trigger: 'blur'}],
          sort: [{required: true, message: '请输入排序值', trigger: 'blur'}]
        },
        isEdit:false
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created() {
      this.getList();
    },
    filters:{
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      handleAdd() {
        this.dialogEditVisible = true;
        this.ResourceCategoryData = Object.assign({},defaultResourceCategoryData);
        try{
          this.$refs['resourceCategoryForm'].clearValidate();
        }catch (e) {

        }
      },
      handleUpdate(index,row){
        this.dialogEditVisible = true
        this.ResourceCategoryData = Object.assign({},row);
        try{
          this.$refs['resourceCategoryForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该资源分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          });
        });
      },
      handleDialogConfirm(ref) {
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.$confirm('是否要确认?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.ResourceCategoryData.id != null) {
                fetchUpdate(this.ResourceCategoryData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              } else {
                fetchCreate(this.ResourceCategoryData).then(res => {
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
      getList() {
        this.listLoading = true;
        fetchListAll().then(res => {
          this.listLoading = false;
          this.list = res.data;
        });
      }
    }
  }
</script>
<style>
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
