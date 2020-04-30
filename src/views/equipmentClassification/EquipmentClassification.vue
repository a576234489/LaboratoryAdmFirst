<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
              v-show="showBackBtn"
              class="btn-back"
              @click="handleBack()"
              size="mini">
        返回
      </el-button>
      <el-button
              class="btn-add"
              @click="handleAdd()"
              size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
              style="width: 100%"
              :data="list"
              v-loading="listLoading" border
      >
        <el-table-column label="编号" width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center">
          <template slot-scope="scope">
            <el-button
                    size="mini"
                    type="text"
                    :disabled="haveLowLevel(scope.row)"
                    @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
                    size="mini"
                    type="text"
                    @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                    size="mini"
                    type="text"
                    @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes,prev, pager, next,jumper"
              :page-size="listQuery.pageSize"
              :page-sizes="[10,15,20]"
              :current-page.sync="listQuery.pageNum"
              :total="total">
      </el-pagination>
    </div>
    <el-dialog
            :title="isEdit?'编辑实验室':'添加实验室'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%">
      <el-form :model="equipmentClassificationData"
               label-width="208px" size="small"
               ref="equipClassificationForm"
               :rules="rules"
      >
        <el-form-item label="实验室名称：" prop="name">
          <el-input v-model="equipmentClassificationData.name" style="width: 250px" clearable placeholder="请输入实验室名称"></el-input>
        </el-form-item>
        <el-form-item label="上级实验室：" prop="parentId">
          <el-select v-model="equipmentClassificationData.parentId"
                     placeholder="请选择上级实验室" style="width: 250px"
                     @change="handlePreClassChange"
                     clearable
          >
            <el-option
                    v-for="item in selectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('equipClassificationForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList,fetchCreate,fetchUpdate,fetchDelete} from 'network/equipmentClassification'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  const defaultEquipmentClassificationData = {
    id: null,
    name: null,
    parentId: null
  };
  export default {
    name: "EquipmentClassification",
    data(){
      return {
        list: null,
        total: null,
        listLoading: true,
        showBackBtn:false,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
        dialogEditVisible:false,
        isEdit:false,
        parentId:0,
        equipmentClassificationData:JSON.parse(JSON.stringify(defaultEquipmentClassificationData)),
        selectList:[],
        rules: {
          name: [{required: true, message: '请输入实验室名称', trigger: 'blur'}],
          parentId: [
            {required: true, message: '请选择上级实验室', trigger: 'blur'}
          ],
        },
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created() {
      this.getList();
      this.getSelectList();
    },
    methods:{
      handlePreClassChange(){
        this.$refs['equipClassificationForm'].clearValidate('parentId')
      },
      getList() {
        this.listLoading = true;
        fetchGetList(this.parentId, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      haveLowLevel(row){
        if(row.parentId == 0){
          return false
        }
        return true
      },
      handleShowNextLevel(index, row) {
        this.$router.push({path: '/equipmentClassification/equipmentClassificationManagement', query: {parentId: row.id}})
      },
      handleBack(){
        this.$router.go(-1);
        this.showBackBtn = false;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleDelete(index,row){
        this.$confirm('是否要删除实验室?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          })
        });
      },
      handleDialogConfirm(ref){
        this.$refs[ref].validate((valid) => {
          if(valid){
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.equipmentClassificationData.id != null){
                fetchUpdate(this.equipmentClassificationData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              }else{
                fetchCreate(this.equipmentClassificationData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              }
            })
          }else {
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
          this.getSelectList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
      resetParentId(){
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
          this.showBackBtn = true;
        } else {
          this.parentId = 0;
        }
      },
      getSelectList() {
        fetchGetList(0, {pageSize: 100, pageNum: 1}).then(response => {
          this.selectList = response.data.list;
          this.selectList.unshift({id: 0, name: '无上级实验室'});
        });
      },
      handleAdd(){
        this.dialogEditVisible = true;
        this.isEdit = false;
        this.equipmentClassificationData = JSON.parse(JSON.stringify(defaultEquipmentClassificationData))
        try{
          this.$refs['equipClassificationForm'].clearValidate();
        }catch (e) {

        }
      },
      handleUpdate(index,row){
        this.dialogEditVisible = true
        this.isEdit = true;
        this.equipmentClassificationData = Object.assign({},row)
        try{
          this.$refs['equipClassificationForm'].clearValidate();
        }catch (e) {

        }
      },
    },
    watch: {
      $route() {
        this.resetParentId();
        this.getList();
      }
    },
  }
</script>

<style scoped>
  .app-container {
    padding: 25px;
  }
  .operate-container{
    margin-top: 20px;
  }
  .operate-container .btn-add{
    float: right;
  }
  .operate-container .btn-back{
    float: right;
    margin-left: 10px;
  }
  .pagination-container {
    display: inline-block;
    float: right;
    margin-top: 20px;
  }
</style>