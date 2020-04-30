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
          <el-form-item label="设备uuid：">
            <el-input v-model="listQuery.equipmentUuid" placeholder="装备uuid" clearable style="width: 203px"></el-input>
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="listQuery.equipmentName" placeholder="装备名称" clearable style="width: 203px"></el-input>
          </el-form-item>
        </el-form>
      </div>
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
        <el-table-column label="设备uuid" align="center" prop="equipment.equipmentUuid" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="设备名称" align="center" prop="equipment.equipmentName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="预约人名称" align="center" prop="userInfo.nickName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="处理人名称" align="center" prop="userInfoHandle.nickName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="预约开始时间" align="center" prop="userInfo.telephone" width="155px" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.startTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="预约结束时间" align="center" prop="userInfo.telephone" width="155px" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.endTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="实际开始时间" align="center" prop="userInfo.telephone" width="155px" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.actualStartTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="实际结束时间" align="center" prop="userInfo.telephone" width="155px" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.actualEndTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="预约状态" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.status|formatStatus}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes,prev, pager, next,jumper"
              :current-page.sync="listQuery.pageNum"
              :page-size="listQuery.pageSize"
              :page-sizes="[10,15,20]"
              :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import {fetchGetList} from 'network/equipmentAppointment'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    equipmentUuid: null,
    equipmentName: null,
  };
  const defaultEquipmentAppointmentData = {
    id: null,
    userId: null,
    equipmentId: null,
    startTime: null,
    actualStartTime:null,
    actualEndTime:null,
    handleUserId:null,
    status:null,
    createTime:null,
    userInfo:{
      id:null,
      nickName:null,
    },
    userInfoHandle:{
      id:null,
      nickName:null,
    },
    equipment:{
      id:null,
      equipmentUrl:null,
      equipmentName:null
    }
  };
  export default {
    name: "EquipmentAppointment",
    data(){
      return{
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        equipmentAppointmentData: Object.assign({}, defaultEquipmentAppointmentData),
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
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
      },
      handleSizeChange(val){//改变每页显示多少条时触发
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getList();
      },
    },
    filters:{
      formatTime(time){
        if(time == null || time == ''){
          return '';
        }
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(value){
        if(value == 1){
          return '待呈批'
        }else if(value == 3){
          return '已结束'
        }else if(value == 4){
          return '已取消'
        }else if(value == 7){
          return '已拒绝'
        }else{
          return '已通过'
        }

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