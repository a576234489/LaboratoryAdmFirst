<template>
  <div class="app-container">
    <el-card>
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
                style="float:right"
                type="primary"
                @click="handleSearchList()"
                size="small">
          查询搜索
        </el-button>
        <el-button
                style="float:right;margin-right: 15px"
                @click="handleResetSearch()"
                size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="账户名：">
            <el-input v-model="listQuery.username" placeholder="账户名" clearable></el-input>
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="listQuery.nickName" placeholder="昵称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
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
        <el-table-column label="账号名" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center" prop="userInfo.nickName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="是否封号" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-switch
                    @change="handleIsLockedChange(scope.$index, scope.row)"
                    :active-value="0"
                    :inactive-value="1"
                    v-model="scope.row.isLocked">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否禁止预约" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-switch
                    @change="handleIsAppointmentChange(scope.$index, scope.row)"
                    :active-value="2"
                    :inactive-value="1"
                    v-model="scope.row.isAppointment">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="学校" align="center" prop="userInfo.school" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="专业" align="center" prop="userInfo.major" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="电话" align="center" prop="userInfo.telephone" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="性别" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.userInfo.sex | formatSex}}</template>
        </el-table-column>
        <el-table-column label="入学期" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.userInfo.entrance}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {fetchGetListOrdinary,fetchUpdateIsLocked,fetchUpdateIsAppointment} from 'network/appUser'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    username: null,
    nickName: null,
  };
  const defaultCUserData = {
    id: null,
    username: null,
    password: null,
    isLocked: null,
    isAppointment: null,
    remark:null,
    accountType:null,
    classificationId:null,
    classificationDetailId:null,
    classificationIdArray:null,
    createTime:null,
    updateTime:null,
    userInfo:{
      id:null,
      headImg:null,
      userId:null,
      nickName:null,
      school:null,
      major:null,
      telephone:null,
      sex:null,
      entrance:null,
    }
  };
  export default {
    name: "AppOrdinaryUser",
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        cUserData: Object.assign({}, defaultCUserData),
        isEdit:false,
      }
    },
    created(){
      this.getList();
    },
    mixins: [columnSortMixin,commonMixin],
    methods:{
      getList(){
        this.listLoading = true;
        fetchGetListOrdinary(this.listQuery).then(res=>{
          this.listLoading = false;
          this.list = res.data.list;
          this.total = res.data.total;
        })
      },
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
        this.classificationIdArray = []
      },
      handleIsLockedChange(index,row){
        if(row.isLocked == 0){
          this.isLockedChangeProcess('是否要封禁该用户','封禁用户成功','封禁用户失败',row)
        }else{
          this.isLockedChangeProcess('是否要启用该用户','启用用户成功','启用用户失败',row)
        }
      },
      handleIsAppointmentChange(index,row){
        if(row.isAppointment == 2){
          this.isAppointmentChangeProcess('是否要禁止该用户预约功能','禁止用户预约功能成功','封禁用户预约功能失败',row)
        }else{
          this.isAppointmentChangeProcess('是否要启用该用户预约功能','启用用户预约功能成功','启用用户预约功能失败',row)
        }
      },
      isLockedChangeProcess(confirmMsg,resultSuccessMsg,resultFailedMsg,row){
        this.$confirm(confirmMsg,'提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          fetchUpdateIsLocked(row.id,{isLocked:row.isLocked}).then(res=>{
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
      },
      isAppointmentChangeProcess(confirmMsg,resultSuccessMsg,resultFailedMsg,row){
        this.$confirm(confirmMsg,'提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          fetchUpdateIsAppointment(row.id,{isAppointment:row.isAppointment}).then(res=>{
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
      },
    },
    filters:{
      formatTime(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
      formatSex(value){
        if(value == 1){
          return '男'
        }
        return '女'
      },
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
</style>