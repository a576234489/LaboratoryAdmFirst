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
        <el-table-column label="内容"  align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="180px" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime|formatTime}}</template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" width="180px" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.updateTime|formatTime}}</template>
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
            :title="isEdit?'添加公告':'编辑公告'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%">
      <el-form :model="noticeData"
               label-width="208px" size="small"
               ref="noticeForm"
               :rules="rules"
      >
        <el-form-item label="公告内容：" prop="content">
          <el-input
                  style="width: 250px;"
                  :autoSize="true"
                  :rows="5"
                  v-model="noticeData.content"
                  type="textarea"
                  placeholder="请输入公告内容"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('noticeForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchListAll,fetchCreate,fetchUpdate,fetchDelete} from 'network/notice';
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultNoticeData={
    id:null,
    content:null,
    status:null,
    createTime:null,
    updateTime:null,
  };
  export default {
    name: "Notice",
    data(){
      return {
        list: null,
        listLoading: false,
        dialogEditVisible:false,
        noticeData:JSON.parse(JSON.stringify(defaultNoticeData)),
        isEdit:false,
        rules: {
          content: [{required: true, message: '公告不能为空', trigger: 'blur'}],
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
      handleAdd() {
        this.isEdit = true;
        this.dialogEditVisible = true;
        this.noticeData = JSON.parse(JSON.stringify(defaultNoticeData));
        try{
          this.$refs['noticeForm'].clearValidate();
        }catch (e) {

        }
      },
      handleUpdate(index,row){
        this.isEdit = false;
        this.dialogEditVisible = true;
        this.noticeData = Object.assign({},row);
        try{
          this.$refs['noticeForm'].clearValidate();
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
              if (this.noticeData.id != null) {
                fetchUpdate(this.noticeData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              } else {
                fetchCreate(this.noticeData).then(res => {
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
      handleDelete(index,row){
        this.$confirm('是否要删除该公告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          });
        });
      },
    },
    filters:{
      formatTime(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
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