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
        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="菜单级数" width="100" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="前端名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="前端图标" width="100" align="center">
          <template slot-scope="scope"><svg-icon :icon-class="scope.row.icon"></svg-icon></template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
                    @change="handleHiddenChange(scope.$index, scope.row)"
                    :active-value="0"
                    :inactive-value="1"
                    v-model="scope.row.hidden">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center">
          <template slot-scope="scope">
            <el-button
                    size="mini"
                    type="text"
                    :disabled="scope.row.level | disableNextLevel"
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
            :title="isEdit?'编辑菜单':'添加菜单'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%">
      <el-form :model="menuData"
               label-width="208px" size="small"
               :rules="rules"
               ref="menuForm"
      >
        <el-form-item label="菜单名称：" prop="title">
          <el-input placeholder="请输入菜单名称" v-model="menuData.title" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="parentId">
          <el-select v-model="menuData.parentId"
                     placeholder="请选择菜单"
                     style="width: 250px" clearable
                     @change="handleMenuChange"
          >
            <el-option
                    v-for="item in selectMenuList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="前端名称：" prop="name">
          <el-input placeholder="请输入前端名称" v-model="menuData.name" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="前端图标：" prop="icon">
          <el-input placeholder="请输入前端图标" v-model="menuData.icon" style="width: 250px" clearable></el-input>
          <svg-icon style="margin-left: 8px" :icon-class="menuData.icon"></svg-icon>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-radio-group v-model="menuData.hidden" >
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input placeholder="请输入排序值" v-model="menuData.sort" style="width: 250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('menuForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList,fetchCreate,fetchUpdate,fetchDelete,fetchUpdateHidden} from 'network/menu'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  const defaultMenuData = {
    id:null,
    title: '',
    parentId: 0,
    name: '',
    icon: '',
    hidden: 0,
    sort: 0,
  };
  export default {
    name: "Menu",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
        parentId: 0,
        showBackBtn:false,
        menuData:Object.assign({},defaultMenuData),
        selectMenuList:[],
        isEdit:false,
        dialogEditVisible:false,
        rules: {
          title: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
          parentId: [{required: true, message: '请选择上级菜单', trigger: 'blur'}],
          name: [{required: true, message: '请输入前端名称', trigger: 'blur'}],
          icon: [{required: true, message: '请输入前端图标', trigger: 'blur'}],
          sort: [{required: true, message: '请输入排序值', trigger: 'blur'}],
        },
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getList();
      this.getSelectMenuList();
    },
    methods:{
      getList() {
        this.listLoading = true;
        fetchGetList(this.parentId, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleMenuChange(){
        this.$refs['menuForm'].clearValidate('parentId');
      },
      handleShowNextLevel(index, row) {
        this.$router.push({path: '/systemBasic/menu', query: {parentId: row.id}})
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
      getSelectMenuList() {
        fetchGetList(0, {pageSize: 100, pageNum: 1}).then(response => {
          this.selectMenuList = response.data.list;
          this.selectMenuList.unshift({id: 0, title: '无上级菜单'});
        });
      },
      handleAdd(){
        this.dialogEditVisible = true;
        this.isEdit = false;
        this.menuData = JSON.parse(JSON.stringify(defaultMenuData));
        try{
          this.$refs['menuForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDialogConfirm(ref){
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.menuData.id != null){
                fetchUpdate(this.menuData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              }else{
                fetchCreate(this.menuData).then(res => {
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
          this.getSelectMenuList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
      handleUpdate(index,row){
        this.dialogEditVisible = true
        this.isEdit = true;
        this.menuData = Object.assign({},row)
        try{
          this.$refs['menuForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          })
        });
      },
      handleHiddenChange(index,row){
        console.log(index,row)
        if(row.hidden == 1){
          console.log('隐藏')
          this.handleHiddenChangeProcess('是否要隐藏该菜单',row)
        }else{
          this.handleHiddenChangeProcess('是否要显示该菜单',row)
        }
      },
      handleHiddenChangeProcess(confirmMsg,row){
        this.$confirm(confirmMsg,'提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          fetchUpdateHidden({id:row.id,hidden:row.hidden}).then(res=>{
            if(res.code == 200){
              this.$message({
                type:'success',
                message:res.message
              })
            }else{
              this.$message({
                type:'error',
                message:res.message
              })
              this.getList();
            }
          })
        })
      }
    },
    filters:{
      levelFilter(value) {
        if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
      },
      disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      }
    },
    watch: {
      $route(route) {
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
