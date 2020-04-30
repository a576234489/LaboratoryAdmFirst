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
        <el-table-column label="维修人员账号" align="center" prop="user.username" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="维修人员名称" align="center" prop="userInfo.nickName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="维修人员电话" align="center" prop="userInfo.telephone" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="维修状态" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.status|formatStatus}}</template>
        </el-table-column>
        <el-table-column label="维修开始时间" width="160" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.startTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="维修结束时间" width="160" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.endTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleShowReport(scope.$index, scope.row)" v-if="scope.row.status">查看维护报告
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
              :current-page.sync="listQuery.pageNum"
              :page-size="listQuery.pageSize"
              :page-sizes="[10,15,20]"
              :total="total">
      </el-pagination>
    </div>
    <el-dialog
            title="维护报告"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%">
      <div class="report-content">
        <span>{{equipMaintainData.presentation}}</span>
      </div>
      <div class="report-address">
        <span>设备所在实验室：{{equipMaintainData.equipmentClassification.name}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogEditVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList} from 'network/equipmentMaintain'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    equipmentUuid: null,
    equipmentName: null,
  };
  const defaultEquipMaintainData = {
    id: null,
    equipmentId: null,
    presentation: null,
    maintainUserId: null,
    status:null,
    startTime:null,
    endTime:null,
    user:{
      id:null,
      username:null,
    },
    userInfo:{
      id:null,
      nickName:null,
      telephone:null
    },
    equipmentClassification:{
      id:null,
      name:null
    }
  };
  export default {
    name: "EquipmentMaintain",
    data(){
      return{
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        equipMaintainData: Object.assign({}, defaultEquipMaintainData),
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getList();
    },
    methods:{
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
      },
      getList(){
        this.listLoading = true;
        fetchGetList(this.listQuery).then(res=>{
          this.listLoading = false;
          this.list = res.data.list;
          this.total = res.data.total;
        })
      },
      handleShowReport(index,row){
        this.equipMaintainData = Object.assign({},row)
        this.dialogEditVisible = true
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
        if(value == 0){
          return '正在维修中'
        }
        return '维修已完成'
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
  .report-content{
    border: 1px solid #666;
    padding: 15px 15px 100px;
    line-height: 25px;
    text-indent: 2em;
  }
  .report-address{
    line-height: 25px;
    margin-top: 5px;
    margin-bottom: 20px;
  }

</style>