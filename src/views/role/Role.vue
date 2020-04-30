<template>
  <div class="app-container">
    <el-card>
      <div>
        <i class="el-icon-search"></i>
        <span style="margin-left: 2px">筛选搜索</span>
        <el-button
                style="float: right"
                type="primary"
                size="small"
                @click="handleSearchList()"
        >
          查询结果
        </el-button>
        <el-button
                style="float: right;margin-right: 15px"
                size="small"
                @click="handleResetSearch()"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="角色名:">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="角色名" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" style="position: relative">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
              class="btn-add"
              size="mini"
              @click="handleAdd()"
      >
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
              :data="list"
              style="width: 100%"
              v-loading="listLoading"
              @selection-change="handleSelectionChange"
              border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="角色名" width="150" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="角色描述" width="150" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="235" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                      size="mini"
                      type="text"
                      @click="handleSelectMenu(scope.$index, scope.row)">分配菜单
              </el-button>
              <el-button
                      size="mini"
                      type="text"
                      @click="handleSelectResource(scope.$index, scope.row)">分配资源
              </el-button>
            </p>
            <p style="margin-top: 5px">
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
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
              size="small"
              v-model="operateType" placeholder="批量操作"
      >
        <el-option
                v-for="item in operates"
                :key="item.value"
                :label="item.label"
                :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
              style="margin-left: 12px"
              class="search-button"
              type="primary"
              size="small"
              @click="handleBatchOperate()"
      >
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes,prev, pager, next,jumper"
              :page-size="listQuery.pageSize"
              :page-sizes="[5,10,15]"
              :current-page.sync="listQuery.pageNum"
              :total="total">
      </el-pagination>
    </div>

    <el-dialog
            :visible.sync="dialogEditVisible"
            :title="isEdit?'编辑角色':'添加角色'"
            :append-to-body='true'
            width="40%"
    >
      <el-form
              :model="roleData"
              label-width="208px" size="small"
              :rules="rules"
              ref="roleForm"
      >
        <el-form-item prop="name" label="角色名：">
          <el-input placeholder="请输入角色名" v-model="roleData.name" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input placeholder="请输入角色描述" v-model="roleData.description" style="width: 250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('roleForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="分配菜单"
            :visible.sync="dialogMenuVisible"
            :append-to-body='true'
            width="40%">
      <el-card class="form-container" shadow="never">
        <el-tree
                :data="menuTreeList"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps">
        </el-tree>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleMenuTreeDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="分配资源"
            :visible.sync="dialogResourceVisible"
            :append-to-body='true'
            width="55%">
      <el-card class="form-container" shadow="never">
        <div v-for="(cate,index) in allResourceCate" :class="index===0?'top-line':null" :key="'cate'+cate.id">
          <el-row class="table-layout" style="background: #F2F6FC;">
            <el-checkbox v-model="cate.checked"
                         :indeterminate="isIndeterminate(cate.id)"
                         @change="handleCheckAllChange(cate)">
              {{cate.name}}
            </el-checkbox>
          </el-row>
          <el-row class="table-layout">
            <el-col :span="8" v-for="resource in getResourceByCate(cate.id)" :key="resource.id" style="padding: 4px 0">
              <el-checkbox v-model="resource.checked" @change="handleCheckChange(resource)">
                {{resource.name}}
              </el-checkbox>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleResourceDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList,fetchCreate,fetchGetItem,fetchUpdate,fetchDeleteBatch,fetchAllocMenu,fetchGetListMenuByRoleId,fetchGetListResourceByRoleId,fetchAllocResource} from 'network/role'
  import {fetchTreeList} from 'network/menu'
  import {fetchListAll as fetchResCatListAll} from 'network/resouceCategory'
  import {fetchListAll as fetchResListAll} from 'network/resource'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum:1,
    name:null,
    pageSize:5,
  }
  const defaultRoleData = {
    id:null,
    name:null,
    description:null,
    create_time:null,
  }
  export default {
    name: "Role",
    data(){
      return{
        listQuery:Object.assign({},defaultListQuery),
        list:null,
        listLoading:true,
        total:null,
        dialogEditVisible:false,
        dialogMenuVisible:false,
        menuTreeList:[],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        roleId:null,
        roleData:Object.assign({},defaultRoleData),
        operates:[
          {
            label:'删除角色',
            value:'deleteRoleBatch'
          }
        ],
        operateType:null,
        multipleSelection:[],
        isEdit:false,

        allResource: null,
        allResourceCate: null,
        dialogResourceVisible:false,
        rules: {
          name: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
        }
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getList();
    },
    methods:{
      getList(){
        this.listLoading = true;
        fetchGetList(this.listQuery).then(res=>{
          this.listLoading = false;
          this.list = res.data.list;
          this.total = res.data.total;
        })
      },
      handleSizeChange(val){//改变每页显示多少条时触发
        console.log(val)
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        console.log(val)
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
      },
      handleAdd(){
        this.dialogEditVisible = true;
        this.isEdit = false;
        this.roleData = Object.assign({},this.defaultRoleData);
        try{
          this.$refs['roleForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDialogConfirm(ref){
        this.$refs[ref].validate((valid) => {
          if (valid) {
            if(this.roleData.id == null) {
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                fetchCreate(this.roleData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }else{
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                fetchUpdate(this.roleData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }
          }else{
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      handleMenuTreeDialogConfirm(){
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let checkedNodes = this.$refs.tree.getCheckedNodes();
          let checkedMenuIds = new Set();
          if(checkedNodes != null && checkedNodes.length > 0){//存选择的所有节点的菜单id
            checkedNodes.forEach(item => {
              checkedMenuIds.add(item.id)
              if(item.parentId != 0){
                checkedMenuIds.add(item.parentId);
              }
            })
          }
          let params = new URLSearchParams();
          params.append("roleId",this.roleId);
          params.append("menuIds",Array.from(checkedMenuIds));
          fetchAllocMenu(params).then(res => {
            this.handleDialogConfirmResult(res);
          })
        })
      },
      handleDialogConfirmResult(res){
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: 'success',
          });
          this.dialogEditVisible = false;
          this.dialogMenuVisible = false;
          this.dialogResourceVisible = false;
          this.getList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
      handleUpdate(index,row){
        this.dialogEditVisible = true
        this.isEdit = true
        try{
          this.$refs['roleForm'].clearValidate();
        }catch (e) {

        }
        fetchGetItem(row.id).then(res=>{
          this.roleData = Object.assign({},res.data)
        })
      },

      handleDelete(index,row){
        this.$confirm('是否要删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id)
          let params = new URLSearchParams();
          params.append("ids",ids);//后台如果不是用对象接受
          fetchDeleteBatch(params).then(res => {
            if(res.code == 200) {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 1000
              });
              this.getList();
            }else{
              this.$message({
                message: res.message,
                type:'error',
                duration: 1000
              });
            }
          })
        });
      },
      handleDeleteBatch(ids){
        let params = new URLSearchParams;
        params.append('ids',ids);
        fetchDeleteBatch(params).then(res => {
          if(res.code == 200) {
            this.$message({
              message: '批量删除用户成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          }else{
            this.$message({
              message: '批量删除用户失败',
              type: 'success',
              duration: 1000
            });
          }
        });
      },
      handleBatchOperate(){
        console.log(this.operateType)
        if(this.operateType == null){
          this.$message({
            message:'请选择操作类型',
            type:'warning',
            duration:1000
          })
          return
        };
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的用户',
            type: 'warning',
            duration: 1000
          });
          return;
        };
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          this.multipleSelection.forEach(item => {
            ids.push(item.id)
          })
          switch (this.operateType) {
            case this.operates[0].value:
              this.handleDeleteBatch(ids)
              break;
          }
        })
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSelectMenu(index,row){
        this.dialogMenuVisible = true;
        this.roleId = row.id;
        fetchTreeList().then(res => {
          this.menuTreeList = res.data;
        })
        fetchGetListMenuByRoleId(row.id).then(res => {
          let menuList = res.data;
          let checkedMenuIds = [];
          if(menuList != null && menuList.length > 0){
            menuList.forEach(item => {
              if(item.parentId != 0){
                checkedMenuIds.push(item.id);
              }
            })
          }
          console.log(checkedMenuIds)
          this.$refs.tree.setCheckedKeys(checkedMenuIds);
        })
      },

      handleSelectResource(index,row){
        this.dialogResourceVisible = true;
        this.roleId = row.id;
        this.getAllResourceCateList();
      },
      getAllResourceCateList() {
        fetchResCatListAll().then(res => {
          this.allResourceCate = res.data;
          this.allResourceCate.forEach(item => {
            item.checked = false;
          })
          this.getAllResourceList();
        });
      },
      getAllResourceList() {
        fetchResListAll().then(res => {
          this.allResource = res.data;
          this.allResource.forEach(item => {
            item.checked = false;
          })
          this.getResourceByRole(this.roleId);
        });
      },
      getResourceByRole(roleId){
        fetchGetListResourceByRoleId(roleId).then(res=>{
          let allocResource = res.data;
          this.allResource.forEach(item=>{
            item.checked = this.getResourceChecked(item.id,allocResource);
          });
          this.allResourceCate.forEach(item=>{
            item.checked = this.isAllChecked(item.id);
          });
          this.$forceUpdate();
        });
      },
      getResourceChecked(resourceId,allocResource){
        if(allocResource==null||allocResource.length===0) return false;
        let item = allocResource.find(item => {
          return item.id == resourceId;
        })
        if(item){
          return true
        }
        return false;
      },
      isAllChecked(categoryId) {
        let cateResources = this.getResourceByCate(categoryId);
        if (cateResources == null) return false;
        let checkedCount = 0;
        for (let i = 0; i < cateResources.length; i++) {
          if (cateResources[i].checked === true) {
            checkedCount++;
          }
        }
        if(checkedCount===0){
          return false;
        }
        return checkedCount === cateResources.length;
      },
      getResourceByCate(categoryId) {
        let cateResource = [];
        if (this.allResource == null) return null;
        for (let i = 0; i < this.allResource.length; i++) {
          let resource = this.allResource[i];
          if (resource.categoryId === categoryId) {
            cateResource.push(resource);
          }
        }
        return cateResource;
      },
      isIndeterminate(categoryId) {
        let cateResources = this.getResourceByCate(categoryId);
        if (cateResources == null) return false;
        let checkedCount = 0;
        for (let i = 0; i < cateResources.length; i++) {
          if (cateResources[i].checked === true) {
            checkedCount++;
          }
        }
        return !(checkedCount === 0 || checkedCount === cateResources.length);
      },
      handleCheckChange(resource) {
        this.allResourceCate.forEach(item=>{
          if(item.id===resource.categoryId){
            item.checked = this.isAllChecked(resource.categoryId);
          }
        });
        this.$forceUpdate();
      },
      handleResourceDialogConfirm(){
        this.$confirm('是否分配资源？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let checkedResourceIds = new Set();
          if (this.allResource != null && this.allResource.length > 0) {
            this.allResource.forEach(item => {
              if (item.checked) {
                checkedResourceIds.add(item.id);
              }
            });
          }
          let params = new URLSearchParams();
          params.append("roleId", this.roleId);
          params.append("resourceIds", Array.from(checkedResourceIds));
          fetchAllocResource(params).then(res => {
            this.handleDialogConfirmResult(res)
          })
        })
      },
      handleCheckAllChange(cate){
        let cateResources = this.getResourceByCate(cate.id);
        for (let i = 0; i < cateResources.length; i++) {
          cateResources[i].checked = cate.checked;
        }
        this.$forceUpdate();
      }
    },
    filters:{
      formatCreateTime(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(status){
        if(status == 1){
          return '启用'
        }
        return '禁用'
      }
    }
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
  .pagination-container {
    display: inline-block;
    float: right;
    margin-top: 20px;
  }
  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }
  .table-cell-title{
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
  .batch-operate-container{
    display: inline-block;
    margin-top: 20px;
  }
  .table-layout {
    padding: 20px;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  .top-line {
    border-top: 1px solid #DCDFE6;
  }
</style>
