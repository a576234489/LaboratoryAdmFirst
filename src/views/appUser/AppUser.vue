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
            <el-input v-model="listQuery.username" placeholder="账户名" clearable style="width: 203px"></el-input>
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="listQuery.nickName" placeholder="昵称" clearable style="width: 203px"></el-input>
          </el-form-item>
          <el-form-item label="所属实验室：">
            <el-cascader
                    clearable
                    v-model="classificationIdArray"
                    :options="classificationOptions"
                    style="width: 203px"
            >
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
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
        <el-table-column label="所属实验室" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.classificationName}}</template>
        </el-table-column>
        <el-table-column label="是否锁定" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.isLocked|formatLock}}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center" prop="userInfo.nickName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="电话号码" align="center" prop="userInfo.telephone" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="160" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.updateTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
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
              :current-page.sync="listQuery.pageNum"
              :page-size="listQuery.pageSize"
              :page-sizes="[10,15,20]"
              :total="total">
      </el-pagination>
    </div>
    <el-dialog
            :title="isEdit?'编辑管理员':'添加管理员'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="40%">
      <el-form :model="cUserData"
               label-width="208px" size="small"
               ref="appUserForm"
               :rules="rules"
      >
        <el-form-item label="账号名：" prop="username">
          <el-input v-model="cUserData.username" style="width: 250px" clearable placeholder="请输入账号名"></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="userInfo.nickName">
          <el-input v-model="cUserData.userInfo.nickName" style="width: 250px" clearable placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="cUserData.userInfo.sex" >
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专业：">
          <el-input v-model="cUserData.userInfo.major" style="width: 250px" clearable placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item label="所属学校：" prop="userInfo.school">
          <el-input v-model="cUserData.userInfo.school" style="width: 250px" clearable placeholder="请输入所属学校"></el-input>
        </el-form-item>
        <el-form-item label="电话号码：" prop="userInfo.telephone">
          <el-input v-model="cUserData.userInfo.telephone" style="width: 250px" clearable placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item label="入学期：">
          <el-input v-model="cUserData.userInfo.entrance" style="width: 250px" clearable placeholder="请输入入学期"></el-input>
        </el-form-item>
        <el-form-item label="所属实验室：" placeholder="请选择实验室" prop="classificationIdArray">
          <el-cascader
                  clearable
                  v-model="cUserData.classificationIdArray"
                  :options="classificationOptions"
                  style="width: 250px"
                  @change="handleClassificationChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="cUserData.remark"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入备注"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('appUserForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList,fetchCreate,fetchUpdate,fetchDelete} from 'network/appUser'
  import {fetchListWithChildren as fetchClassificationListWithChildren } from 'network/equipmentClassification'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  import {validatePhone} from 'common/validate'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    username: null,
    nickName: null,
    classificationId:null,
  };
  const defaultCUserData = {
    id: null,
    username: null,
    password: null,
    isLocked: null,
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
      sex:1,
      entrance:null,
    }
  };
  export default {
    name: "AppUser",
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        cUserData: Object.assign({}, defaultCUserData),
        isEdit:false,
        classificationOptions:[],
        classificationIdArray:[],//搜索对应的实验室类型
        rules: {
          username: [
            {required: true, message: '请输入账号名', trigger: 'blur'},
            { validator: validatePhone, message: "请输入合法的手机号码", trigger: 'blur'}
          ],
          'userInfo.nickName': [
            {required: true, message: '请输入用户昵称', trigger: 'blur'}
          ],
          'userInfo.school': [{required: true, message: '请输入所属学校', trigger: 'blur'}],
          'userInfo.telephone': [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            { validator: validatePhone, message: "请输入合法的手机号码", trigger: 'blur'}
          ],
          classificationIdArray: [{required: true, message: '请选择所属实验室', trigger: 'blur'}],
        },
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getEquipmentClassificationList();
      this.getList();
    },
    methods:{
      handleClassificationChange(){
        this.$refs['appUserForm'].clearValidate('classificationIdArray');
        this.$forceUpdate()
      },
      getEquipmentClassificationList(){
        fetchClassificationListWithChildren().then(res => {
          this.classificationOptions = [];
          res.data.forEach(item => {
            let children = [];
            if (item.children != null && item.children.length > 0) {
              item.children.forEach(item2 => {
                children.push({label: item2.name, value: item2.id});
              })
            }
            this.classificationOptions.push({label: item.name, value: item.id, children: children});
          })
        })
      },
      getList(){
        this.listLoading = true;
        if(this.classificationIdArray.length > 0){
          this.listQuery.classificationId = this.classificationIdArray[this.classificationIdArray.length - 1]//设置实验室id
        }
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
        this.classificationIdArray = []
      },
      handleAdd(){
        this.dialogEditVisible = true;
        this.isEdit = false;
        this.cUserData = JSON.parse(JSON.stringify(defaultCUserData))
        try{
          this.$refs['appUserForm'].clearValidate();
        }catch (e) {

        }
      },
      handleUpdate(index,row){
        this.cUserData = JSON.parse(JSON.stringify(row));
        this.cUserData.userInfo.sex = parseInt(this.cUserData.userInfo.sex);
        if(this.cUserData.classificationDetailId != null && this.cUserData.classificationDetailId != ''){
          this.$set(this.cUserData, 'classificationIdArray', this.cUserData.classificationDetailId.split(',').map(item => parseInt(item)));
        }else{
          this.$set(this.cUserData, 'classificationIdArray', []);
        }
        this.dialogEditVisible = true
        this.isEdit = true;
        try{
          this.$refs['appUserForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该管理员账号?', '提示', {
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
            if(this.cUserData.id == null) {
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.cUserData.classificationId = this.cUserData.classificationIdArray[this.cUserData.classificationIdArray.length - 1]//设置实验室id
                this.cUserData.classificationDetailId = this.cUserData.classificationIdArray.join(',');//设置实验室id详情
                fetchCreate(this.cUserData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }else{
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.cUserData.classificationId = this.cUserData.classificationIdArray[this.cUserData.classificationIdArray.length - 1]//设置实验室id
                this.cUserData.classificationDetailId = this.cUserData.classificationIdArray.join(',');//设置实验室id详情
                fetchUpdate(this.cUserData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }
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
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
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
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
      formatLock(value){
        if(value == 0){
          return '禁用'
        }
        return '启用'
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