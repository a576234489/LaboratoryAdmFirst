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
          查询搜索
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
          <el-form-item label="账号名:">
            <el-input style="width: 203px" v-model="listQuery.username" placeholder="账户名" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名:">
            <el-input style="width: 203px" v-model="listQuery.nickName" placeholder="姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属角色：">
            <el-select v-model="listQuery.roleId" placeholder="请选择角色" clearable style="width: 203px">
              <el-option
                      v-for="item in roleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否锁定：">
            <el-select v-model="listQuery.status" placeholder="请选择用户状态" clearable style="width: 203px">
              <el-option
                      v-for="item in isLockingOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" style="position: relative">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button  style="margin:0 0 0 20px;float: left;position: absolute;bottom: 13px" type="primary" size="small" icon="el-icon-document" @click="handleDownloadExcel">
        Export Excel
      </el-button>
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
        <el-table-column label="账号名" width="150" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="昵称" width="150" align="center">
          <template slot-scope="scope">{{scope.row.nickName}}</template>
        </el-table-column>
        <el-table-column label="所属角色" width="150" align="center">
          <template slot-scope="scope">{{scope.row.role.name}}</template>
        </el-table-column>
        <el-table-column label="锁定/解锁" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
                    @change="handleStatusChange(scope.$index, scope.row)"
                    :active-value="0"
                    :inactive-value="1"
                    v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="最后登录时间"  align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.loginTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="235" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                      size="mini"
                      type="text"
                      @click="handleShow(scope.$index, scope.row)">查看
              </el-button>
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
            :title="isEdit?'编辑平台账号':'添加平台账号'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%"
    >
      <el-form
              :model="userAdminData"
              label-width="208px" size="small"
              :rules = "rules"
              ref = "accountForm"
      >
        <el-form-item label="账号名：" prop="username">
          <el-input placeholder="请输入账号名" v-model="userAdminData.username" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickName">
          <el-input placeholder="请输入昵称" v-model="userAdminData.nickName" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属角色：" prop="roleId">
          <el-select v-model="userAdminData.roleId" placeholder="请选择角色" clearable  @change="handleRoleChange" style="width: 250px">
            <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input placeholder="请输入邮箱" v-model="userAdminData.email" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注信息：">
          <el-input placeholder="请输入备注信息" v-model="userAdminData.note" style="width: 250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('accountForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="用户详情"
            :visible.sync="dialogDetailVisible"
            :append-to-body='true'
            width="60%"
    >
      <div class="clear-fix detail">
        <dl class="detail-title">
          <dt><span>用户头像</span></dt>
          <dd><span>用户编号</span></dd>
          <dd><span>账号名</span></dd>
          <dd><span>用户邮箱</span></dd>
          <dd><span>用户昵称</span></dd>
          <dd><span>备注信息</span></dd>
          <dd><span>创建时间</span></dd>
          <dd><span>最后登录时间</span></dd>
          <dd><span>账号状态</span></dd>
        </dl>
        <dl class="detail-title detail-content">
          <dt><a href="#" @click="handleImg(userAdminDetailData.icon)"><img :src="userAdminDetailData.icon"></a></dt>
          <dd><span>{{userAdminDetailData.id|formatContentLast}}</span></dd>
          <dd><span>{{userAdminDetailData.username|formatContentLast}}</span></dd>
          <dd><span>{{userAdminDetailData.email|formatContentLast}}</span></dd>
          <dd><span>{{userAdminDetailData.nickName|formatContentLast}}</span></dd>
          <dd><span>{{userAdminDetailData.note|formatContentLast}}</span></dd>
          <dd><span>{{userAdminDetailData.createTime|formatCreateTime|formatContentLast}}</span></dd>
          <dd><span>{{userAdminDetailData.loginTime|formatCreateTime|formatContentLast}}</span></dd>
          <dd><span>{{userAdminDetailData.status|formatStatus|formatContentLast}}</span></dd>
        </dl>
      </div>
    </el-dialog>
    <el-dialog
            :visible.sync="dialogImageVisible"
            :append-to-body='true'
            width="40%"
    >
      <div class="image-parent">
        <img :src="pendingShowImage" :style="'width:' + imageWidth+'px;'+'height:'+imageHeight+'px'">
        <img @load="handleImageOnload" ref='imgShow' :src="pendingShowImage" style="display:none">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList,fetchUpdateStatus,fetchCreate,fetchGetItem,fetchUpdate,fetchDeleteBatch,fetchUpdateStatusBeach} from 'network/plateformAccount'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  import {validatePhone,validateEMail} from 'common/validate'
  let formatDate = require("common/utils");
  import {fetchListAll as fetchRoleListAll} from "network/role";
  import {export_json_to_excel} from '@/vendor/Export2Excel'
  const defaultListQuery = {
    pageNum:1,
    username:null,
    nickName:null,
    pageSize:5,
    roleId:null,
    status:null,
  }
  const defaultUserAdminData = {
    nickName:null,
    id:null,
    createTime:null,
    icon:null,
    email:null,
    username:null,
    loginTime:null,
    note:null,
    password:null,
    roleId:null
  }
  export default {
    name: "PlateformAccount",
    data(){
      return{
        listQuery:Object.assign({},defaultListQuery),
        roleOptions: [],
        isLockingOptions:[],
        list:null,
        listLoading:true,
        total:null,
        dialogEditVisible:false,
        dialogDetailVisible:false,
        userAdminData:Object.assign({},defaultUserAdminData),
        userAdminDetailData:{},
        operates:[
          {
            label:'锁定账号',
            value:'1ockAccountBatch',
          },
          {
            label:'解锁账号',
            value:'unLockAccountBatch'
          },
          {
            label:'删除账号',
            value:'deleteAccountBatch'
          }
        ],
        operateType:null,
        multipleSelection:[],
        downloadLoading:false,
        rules: {
          username: [
            { required: true, message: "请输入账号名", trigger: 'blur'},
            { validator: validatePhone, message: "请输入合法的手机号码", trigger: 'blur'}
          ],
          nickName: [{required: true, message: '请输入昵称', trigger: 'blur'}],
          roleId: [{required: true, message: '请选择角色', trigger: 'blur'}],
          email: [{ validator: validateEMail, message: "请输入合法的邮箱", trigger: 'blur'}],
        },
        isEdit: false
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getRoleList();
      this.initIsLockOption();
      this.getList();
    },
    methods:{
      getRoleList(){
        fetchRoleListAll().then(res=>{
          this.roleOptions = [];
          let roleList = res.data;
          roleList.forEach(item=>{
            this.roleOptions.push({label:item.name,value:item.id})
          })
        })
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
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
      },
      initIsLockOption(){
        this.isLockingOptions = [];
        this.isLockingOptions.push({label: '正常',value: 1});
        this.isLockingOptions.push({label: '锁定',value: 0});
      },
      getList(){
        this.listLoading = true;
        fetchGetList(this.listQuery).then(res=>{
          this.listLoading = false;
          this.list = res.data.list;
          this.total = res.data.total;
        })
      },
      handleStatusChange(index,row){
        if(row.status == 0){
          this.StatusChangeProcess('是否要禁用该用户','禁用用户成功','禁用用户失败',row)
        }else{
          this.StatusChangeProcess('是否要启用该用户','启用用户成功','启用用户失败',row)
        }
      },
      handleStatusChangeBatch(ids,status){
        let params = new URLSearchParams();
        params.append('ids',ids);
        params.append('status',status);
        let resultMsgSuccess = ''
        let resultMsgFail = ''
        if(status == 0){
          resultMsgSuccess = '批量锁定用户成功'
          resultMsgFail = '批量锁定用户失败'
        }else {
          resultMsgSuccess = '批量解锁用户成功'
          resultMsgFail = '批量解锁用户失败'
        }
        console.log(resultMsgSuccess)
        fetchUpdateStatusBeach(params).then(res=>{
          if(res.code == 200) {
            this.$message({
              message: resultMsgSuccess,
              type: 'success',
              duration: 1000
            });
          }else{
            this.$message({
              message: resultMsgFail,
              type: 'error',
              duration: 1000
            });
          }
          this.getList();
        })
      },
      StatusChangeProcess(confirmMsg,resultSuccessMsg,resultFailedMsg,row){
        this.$confirm(confirmMsg,'提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          fetchUpdateStatus(row.id,{status:row.status}).then(res=>{
            if(res.code == 200){
              this.$message({
                type:'success',
                message:resultSuccessMsg
              })
            }else{
              this.$message({
                type:'error',
                message:resultFailedMsg
              })
              this.getList();
            }
          })
        })
      },
      handleAdd(){
        this.dialogEditVisible = true;
        this.isEdit = false;
        this.userAdminData = Object.assign({},this.defaultUserAdminData);
        try{
          this.$refs['accountForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDialogConfirm(ref){
        this.$refs[ref].validate((valid) => {
          if (valid) {
            if (this.userAdminData.id == null) {
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                fetchCreate(this.userAdminData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            } else {
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                fetchUpdate(this.userAdminData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }
          } else {
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
      handleUpdate(index,row){
        this.dialogEditVisible = true
        this.isEdit = true
        try{
          this.$refs['accountForm'].clearValidate();
        }catch (e) {

        }
        fetchGetItem(row.id).then(res=>{
          this.userAdminData = Object.assign({},res.data)
          this.userAdminData.roleId = res.data.role.id;
        })
      },
      handleRoleChange(val){
        this.$refs['accountForm'].clearValidate('roleId');
        this.$forceUpdate()
      },
      handleShow(index,row){
        this.dialogDetailVisible = true
        fetchGetItem(row.id).then(res=>{
          this.userAdminDetailData = Object.assign({},res.data)
        })
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该用户?', '提示', {
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
                type: 'error',
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
              this.handleStatusChangeBatch(ids,0)
              break;
            case this.operates[1].value:
              this.handleStatusChangeBatch(ids,1)
              break;
            case this.operates[2].value:
              this.handleDeleteBatch(ids)
              break;
          }
        })
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleDownloadExcel(){
        this.downloadLoading = true;
        const tHeader = ['用户编号','用户名','邮箱','昵称','备注','创建时间','最后登录时间'];
        const filterVal = ['id','username','email','nickName','note','createTime','loginTime']
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
    },
    filters:{
      formatCreateTime(time){
        if(time == null || time == ''){
          return ""
        }
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
  .batch-operate-container{
    display: inline-block;
    margin-top: 20px;
  }

</style>
