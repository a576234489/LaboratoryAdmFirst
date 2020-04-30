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
          <el-form-item label="设备名称：">
            <el-input style="width: 203px" v-model="listQuery.equipmentName" placeholder="设备名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="实验室：">
            <el-cascader style="width: 203px"
                         clearable
                         v-model="classificationIdArray"
                         :options="classificationOptions">
            </el-cascader>
          </el-form-item>
          <div>
            <el-form-item label="费用区间：">
              <el-input style="width: 203px" v-model="listQuery.floorPrice" placeholder="最低费用" clearable></el-input>
            </el-form-item>
            <span class="wave" style="margin: 0 5px 0 -5px">~</span>
            <el-form-item label="">
              <el-input style="width: 203px" v-model="listQuery.highestPrice" placeholder="最高费用" clearable></el-input>
            </el-form-item>
          </div>
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
              @selection-change="handleSelectionChange"
              v-loading="listLoading" border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="设备uuid" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.equipmentUuid}}</template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.equipmentName}}</template>
        </el-table-column>
        <el-table-column label="实验室" align="center" prop="equipmentClassification.name" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="租用费" align="center" :sortable="true" :sort-method="sortByDate"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.qeuipmentPriece}}</template>
        </el-table-column>
        <el-table-column label="是否有图片" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.equipmentUrl|formatEquipmentUrl}}</template>
        </el-table-column>
        <el-table-column label="是否有视频" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.equipmentStudyVideos|formatStudyVideos}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
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
              :current-page.sync="listQuery.pageNum"
              :page-size="listQuery.pageSize"
              :page-sizes="[10,15,20]"
              :total="total">
      </el-pagination>
    </div>
    <el-dialog
            :title="isEdit?'编辑设备':'添加设备'"
            :visible.sync="dialogEditVisible"
            :append-to-body='true'
            width="58%">
        <div style="height:475px;overflow-y: scroll;" class="test-5">
          <el-steps :active="active" finish-status="success" align-center class="option-tab">
            <el-step title="基本信息"></el-step>
            <el-step title="操作手册"></el-step>
            <el-step title="开放时间段"></el-step>
            <el-step title="设备视频"></el-step>
          </el-steps>
          <el-form :model="equipData"
                   label-width="170px" size="small"
                   ref="equipmentFormBasic"
                   :rules="rules"
                   v-show="showStatus[0]"
          >
            <el-form-item label="设备名称：" prop="equipmentName">
              <el-input v-model="equipData.equipmentName" style="width: 598px" clearable placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item label="租用费：" prop="qeuipmentPriece">
              <el-input v-model="equipData.qeuipmentPriece" type="number" style="width: 598px" clearable
                        placeholder="请输入租用费"></el-input>
            </el-form-item>
            <div>
              <el-form-item label="租用地点：" class="equip-address" prop="equipmentAddress">
                <el-input v-model="equipData.equipmentAddress" style="width: 353px" clearable
                          placeholder="请输入租用地点"></el-input>
              </el-form-item>
              <el-form-item label="" class="equip-classification" prop="classificationIdArray">
                <el-cascader
                        clearable
                        v-model="equipData.classificationIdArray"
                        :options="classificationOptions"
                        @change="handleClassificationChange"
                        placeholder="请选择实验室"
                >
                </el-cascader>
              </el-form-item>
            </div>
            <el-form-item label="设备列表图片：" prop="equipmentImg">
              <single-upload v-model="equipData.equipmentImg"
                             style="width: 300px;display: inline-block;margin-left: 10px"
                             @singleClearValidate="singleClearValidate"
              >
              </single-upload>
            </el-form-item>
            <el-form-item label="设备轮播图片：" prop="imageUrlsArray" >
              <div class="lbt-tip"><span> （图片大小750x400）</span></div>
              <multi-upload v-model="equipData.imageUrlsArray" @multiClearValidate="multiClearValidate"></multi-upload>
            </el-form-item>
            <div class="nextButton">
              <el-button type="primary" size="medium" @click="handleNext('equipmentFormBasic')">下一步</el-button>
            </div>
          </el-form>
          <el-form :model="equipData"
                   label-width="170px" size="small"
                   ref="equipmentFormOperationManual"
                   :rules="rules"
                   v-show="showStatus[1]"
          >
            <el-tabs type="card" class="operation-tabs" v-model="tabSelect">
              <el-tab-pane label="基本信息" name="basicInfo">
                <el-form-item prop="basicInfo">
                  <Tinymce @tinyClearValidate="tinyClearValidate('basicInfo')" v-if="dialogEditVisible" ref="editor"
                           v-model="equipData.basicInfo" :height="400" :width="600"/>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="操作手册" name="operationManual">
                <el-form-item prop="operationManual">
                  <Tinymce @tinyClearValidate="tinyClearValidate('operationManual')" v-if="dialogEditVisible" ref="editor"
                           v-model="equipData.operationManual" :height="400" :width="600"/>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div class="nextButton">
              <el-button size="medium" @click="handlePrev">上一步</el-button>
              <el-button type="primary" size="medium" @click="handleNext('equipmentFormOperationManual')">下一步</el-button>
            </div>
          </el-form>
          <el-form :model="equipData"
                   label-width="170px" size="small"
                   ref="equipmentFormOpenTime"
                   :rules="rules"
                   v-show="showStatus[2]"
          >
            <el-form-item label="开放时间断：">
              <ul class="open-time">
                <li v-for="item in equipData.openTimeObject">
                  <div v-if="item.week == '顶部'" class="week-top">
                    <el-checkbox v-model="item2.checked" v-for="item2 in item.timePoint"
                                 @change="handleCheckVerticalAllChange(item2)">
                    </el-checkbox>
                  </div>
                  <div v-else>
                    <el-checkbox v-model="item.horizontalChecked" @change="handleCheckHorizontalAllChange(item)">
                    </el-checkbox>
                    <span>
                    {{item.week}}
                  </span>
                    <a href="#" v-for="item2 in item.timePoint" @click="openTimeClick(item2,item,$event)"
                       :class="isTimePointActive(item2,item.selectPoint)?'time-point-active':'time-point'">{{item2}}</a>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <div class="nextButton">
              <el-button size="medium" @click="handlePrev">上一步</el-button>
              <el-button type="primary" size="medium" @click="handleNext('equipmentFormOpenTime')">下一步</el-button>
            </div>
          </el-form>
          <el-form :model="equipData"
                   label-width="170px" size="small"
                   ref="equipmentFormUploadVideo"
                   :rules="rules"
                   v-show="showStatus[3]"
          >

            <el-form-item label="上传视频：">
              <div class="video-upload" v-for="(item,index) in videoNumber">
                <!--action="http://192.168.168.45:8081/file/upload/video"-->
                <!--action="http://120.78.207.225:8234/file/upload/video"-->
                <!--<p class="text-explain">-->
                <!--<span>视频文件大小最大50M，推荐格式mp4</span>-->
                <!--</p>-->
                <div class="close">
                  <a href="#" @click="delVideoNumber(index)">x</a>
                </div>
                <div class="video-upload-info" v-if="videoButtons[index]">
                  <div class="text-tip"><span>文件上传大小为50M以内,文件格式MP4</span></div>
                  <el-upload class="avatar-uploader"
                             :action="videoUploadUrl"
                             :on-progress="value => uploadVideoProcess(index,value)"
                             :on-success="value => handleVideoSuccess(index,value)"
                             :before-upload="value => beforeUploadVideo(index,value)"
                             :show-file-list="false">
                    <el-button class="video-upload-button" size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </div>
                <div class="video-progress" v-if="!hiddenProgress[index]">
                  <img src="~assets/img/video_list.png">
                  <div class="progress">
                    <div class="delete-info">
                      <span>{{videoNames[index]}}</span>
                      <a href="#" @click="handleDeleteVideo(index)"> 删除</a>
                    </div>
                    <el-progress :percentage="videoUploadPercent[index]" :status="progressStatus[index]"></el-progress>
                  </div>
                </div>
                <!--v-if="!hiddenProgress[index]"-->
                <div class="video-cover" v-if="!hiddenProgress[index]">
                  <div class="video-cover-title"><span>视频封面设置</span></div>
                  <div class="video-cover-image">
                    <div class="custom-image">
                      <el-upload
                              :action="singleUploadUrl"
                              class="upload-comp"
                              list-type="text"
                              :on-success="value => handleImageSuccess(index,value)"
                      >
                        <a class="upload-tag" style="display: block;width: 100px;height: 66px;overflow: hidden;position: relative;">
                          <!--<img class="upload-icon" :src="coverImages[index]">-->
                          <img class="upload-icon" src="~assets/img/video-upload.png" v-show="!coverImages[index]">
                          <div v-show="coverImages[index]" :style="'width:100%;height:100%;background-position: center center; background-size: cover; background-repeat: no-repeat; background-image: url('+coverImages[index]+')'"></div>
                          <!--<img v-show="coverImages[index]" class="upload-image" :src="coverImages[index]">-->
                        </a>
                      </el-upload>
                      <div class="cover-tag">
                        <span>上传封面</span>
                      </div>
                    </div>
                    <div class="intercept-image">
                      <div class="lef-arrow"></div>
                      <div class="intercept-image-tip"><span>可选择以下封面</span></div>
                      <div class="intercept-image-info">
                        <div class="intercept-image-item" v-for="item in videoInterceptImages[index]">
                          <!--<img :src="item" @click="handleCoverTag(index,item)">-->
                          <div @click="handleCoverTag(index,item)" :style="'width:100%;height:100%;background-position: center center; background-size: cover; background-repeat: no-repeat; background-image: url('+item+')'"></div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="video-title" v-for="(item,index2) in videoTitles" v-if="!hiddenProgress[index]&&index2 == index">
                  <span>视频标题</span>
                  <el-input :value="item" class="input-title" clearable placeholder="请输入视频标题" @input="value => updateVideoTitle(index,value)"></el-input>
                </div>
              </div>
              <div class="video-add">
                <el-button class="video-add-button" size="small" @click="addVideo">添加</el-button>
              </div>
            </el-form-item>
            <div class="nextButton">
              <el-button size="medium" @click="handlePrev">上一步</el-button>
              <el-button type="primary" size="medium" @click="handleNext('equipmentFormUploadVideo')">下一步</el-button>
            </div>
          </el-form>
        </div>
    </el-dialog>

    <el-dialog
            title="批量修改开放时间"
            :visible.sync="dialogOpenTimeBatchVisible"
            :append-to-body='true'
            width="58%">
      <el-form :model="equipData"
               label-width="150px" size="small">
        <el-form-item label="开放时间断：">
          <ul class="open-time">
            <li v-for="item in equipData.openTimeObject">
              <div v-if="item.week == '顶部'" class="week-top">
                <el-checkbox v-model="item2.checked" v-for="item2 in item.timePoint"
                             @change="handleCheckVerticalAllChange(item2)">
                </el-checkbox>
              </div>
              <div v-else>
                <el-checkbox v-model="item.horizontalChecked" @change="handleCheckHorizontalAllChange(item)">
                </el-checkbox>
                <span>
                  {{item.week}}
                </span>
                <a href="#" v-for="item2 in item.timePoint" @click="openTimeClick(item2,item,$event)"
                   :class="isTimePointActive(item2,item.selectPoint)?'time-point-active':'time-point'">{{item2}}</a>
              </div>
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOpenTimeBatchVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogOpenTimeConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList, fetchCreate, fetchUpdate, fetchDeleteBatch, fetchUpdateOpenTimeBeach} from 'network/equipment';
  import {fetchListWithChildren as fetchClassificationListWithChildren} from 'network/equipmentClassification'
  import MultiUpload from '@/components/Upload/multiUpload'
  import SingleUpload from 'components/Upload/singleUpload'
  import Tinymce from '@/components/Tinymce'
  import {columnSortMixin, commonMixin} from 'common/mixin'
  import {validateNumber} from 'common/validate'
  import {VIDEP_UPLOAD_URL, SINGLE_UPLOAD_URL} from 'common/const';
  import {fetchUploadBase64} from 'network/base64Upload'
  import ScrollBar from 'components/common/ScrollBar'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    equipmentName: null,
    floorPrice: null,
    highestPrice: null,
    classificationId: null,
  };
  const defaultEquipData = {
    id: null,
    equipmentName: null,
    equipmentUrl: null,
    equipmentImg: null,
    equipmentUuid: null,
    status: null,
    equipmentAddress: null,
    basicInfo: null,
    operationManual: null,
    qeuipmentPriece: null,
    classificationId: null,
    classificationDetailId: null,
    create_time: null,
    equipmentClassification: {},
    equipmentStudyVideos: [],
    imageUrlsArray: [],
    videoUrlArray: [],
    classificationIdArray: [],
    openTimeObject: [
      {
        week: '顶部',
        timePoint: [{checked: false, value: 0}, {checked: false, value: 1}, {checked: false, value: 2}, {
          checked: false,
          value: 3
        }, {checked: false, value: 4}, {checked: false, value: 5}, {checked: false, value: 6},
          {checked: false, value: 7}, {checked: false, value: 8}, {checked: false, value: 9}, {
            checked: false,
            value: 10
          }, {checked: false, value: 11}, {checked: false, value: 12}, {checked: false, value: 13},
          {checked: false, value: 14}, {checked: false, value: 15}, {checked: false, value: 16}, {
            checked: false,
            value: 17
          }, {checked: false, value: 18}, {checked: false, value: 19}, {checked: false, value: 20},
          {checked: false, value: 21}, {checked: false, value: 22}, {checked: false, value: 23}],
      },
      {
        week: '星期一',
        timePoint: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        horizontalChecked: false,
        selectPoint: []
      },
      {
        week: '星期二',
        timePoint: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        horizontalChecked: false,
        selectPoint: []
      },
      {
        week: '星期三',
        timePoint: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        horizontalChecked: false,
        selectPoint: []
      },
      {
        week: '星期四',
        timePoint: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        horizontalChecked: false,
        selectPoint: []
      },
      {
        week: '星期五',
        timePoint: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        horizontalChecked: false,
        selectPoint: []
      },
      {
        week: '星期六',
        timePoint: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        horizontalChecked: false,
        selectPoint: []
      },
      {
        week: '星期天',
        timePoint: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        horizontalChecked: false,
        selectPoint: []
      },
    ],
    videoUrls: null,
    coverImgs: null,
    videoNames:null,
    openTime: null,
    ids: []
  };
  export default {
    name: "Equipment",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        equipData: Object.assign({}, defaultEquipData),
        isEdit: false,
        classificationOptions: [],
        videoFlag: false,
        classificationIdArray: [],//搜索对应的实验室类型
        //视频数量
        videoNumber: [0],
        //上传进度状态
        progressStatus: [''],
        //显示上传按钮
        videoButtons: [true],
        //隐藏进度条
        hiddenProgress: [true],
        //上传的文件名称
        videoNames: [''],
        //截取的视频文件
        videoInterceptImages: [],
        //视频进度
        videoUploadPercent: [0],
        //封面图片
        coverImages: [""],
        //视频文件地址
        videoAddress: [""],
        //视频标题地址
        videoTitles:[''],
        //分类选项卡
        showStatus: [true, false, false, false],
        //当前激活的选项卡
        active: 0,
        //tab选中项
        tabSelect: 'basicInfo',
        operates: [
          {
            label: '删除设备',
            value: 'deleteEquipBatch'
          },
          {
            label: '修改开放时段',
            value: 'updateEquipOpenTimeBatch'
          }
        ],
        videoUploadUrl: VIDEP_UPLOAD_URL,
        singleUploadUrl: SINGLE_UPLOAD_URL,
        operateType: null,
        multipleSelection: [],
        dialogOpenTimeBatchVisible: false,
        rules: {
          equipmentName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
          qeuipmentPriece: [
            {required: true, message: '请输入租用费', trigger: 'blur'},
            {validator: validateNumber, message: "租用费格式不正确", trigger: 'blur'}
          ],
          equipmentAddress: [
            {required: true, message: '请输入租用地点', trigger: 'blur'}
          ],
          classificationIdArray: [{required: true, message: '请选择实验室', trigger: 'blur'}],
          equipmentImg: [{required: true, message: '请上传设备列表图片', trigger: 'blur'}],
          imageUrlsArray: [{required: true, message: '请上传设备轮播图片', trigger: 'blur'}],
          basicInfo: [{required: true, message: '请输入基本信息', trigger: 'blur'}],
          operationManual: [{required: true, message: '请输入操作手册', trigger: 'blur'}],
        },
      }
    },
    mixins: [columnSortMixin, commonMixin],
    created() {
      this.getEquipmentClassificationList();
      this.getList();
    },
    methods: {
      updateVideoTitle(index,val) {
        this.$set(this.videoTitles,index,val)
      },
      handleCoverTag(index, src) {
        // fetchUploadBase64({imageString:src}).then(res => {
        //   this.$set(this.coverImages,index,res.data.url)
        // })
        this.$set(this.coverImages, index, src)
      },
      handleNext(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.nextStep();
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
        if (formName == 'equipmentFormUploadVideo') {
          this.handleDialogConfirm();
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      handlePrev() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      delVideoNumber(index) {
        if (this.videoNumber.length == 1) {
          this.$message({
            message: '只有一个选项卡时不能删除',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.videoNumber.splice(index, 1)
        this.videoTitles.splice(index,1)
        this.progressStatus.splice(index, 1)
        this.videoButtons.splice(index, 1)
        this.hiddenProgress.splice(index, 1)
        this.videoNames.splice(index, 1)
        this.videoUploadPercent.splice(index, 1)
        this.coverImages.splice(index, 1)
        this.videoAddress.splice(index, 1)
      },
      addVideo() {
        if(this.videoNumber.length >= 5){
          this.$message({
            message: '最多添加五个视频',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$set(this.videoNumber, this.videoNumber.length, this.videoNumber.length);
        this.$set(this.progressStatus, this.progressStatus.length, '');
        this.$set(this.videoButtons, this.videoButtons.length, true);
        this.$set(this.hiddenProgress, this.hiddenProgress.length, true);
        this.$set(this.videoNames, this.videoNames.length, '');
        this.$set(this.videoUploadPercent, this.videoUploadPercent.length, 0);
        this.$set(this.coverImages, this.coverImages.length, '');
        this.$set(this.videoAddress, this.videoAddress.length, '');
        this.videoTitles.push('');
      },
      handleClassificationChange() {
        this.$refs['equipmentFormBasic'].clearValidate('classificationIdArray');
        this.$forceUpdate()
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.classificationIdArray = [];
        this.$forceUpdate();
      },
      multiClearValidate() {
        this.$refs['equipmentFormBasic'].clearValidate('imageUrlsArray');
      },
      handleSearchList() {
        this.listQuery.classificationId = null;
        this.listQuery.pageNum = 1;
        if (this.classificationIdArray.length > 0) {
          this.listQuery.classificationId = this.classificationIdArray[this.classificationIdArray.length - 1]//设置实验室id
        }
        this.getList()
      },
      singleClearValidate() {
        this.$refs['equipmentFormBasic'].clearValidate('equipmentImg');
      },
      tinyClearValidate(name) {
        this.$refs['equipmentFormOperationManual'].clearValidate(name);
      },
      getEquipmentClassificationList() {
        fetchClassificationListWithChildren().then(res => {
          this.classificationOptions = [];
          res.data.forEach(item => {
            let children = [];
            if (item.children != null && item.children.length > 0) {
              item.children.forEach(item2 => {
                children.push({label: item2.name, value: item2.id});
              })
              this.classificationOptions.push({label: item.name, value: item.id, children: children});
            }else {
              this.classificationOptions.push({label: item.name, value: item.id});
            }
          })
        })
      },
      handleAdd() {
        this.showStatus = [true, false, false, false];
        this.active = 0;

        this.dialogEditVisible = true;
        this.isEdit = false;
        //this.equipData = Object.assign({},defaultEquipData);
        this.equipData = JSON.parse(JSON.stringify(defaultEquipData))
        try {
          this.$refs['equipmentFormBasic'].clearValidate();
          this.$refs['equipmentFormOperationManual'].clearValidate();
          this.$refs['equipmentFormOpenTime'].clearValidate();
          this.$refs['equipmentFormUploadVideo'].clearValidate();
        } catch (e) {

        }
        //清空视频地址数组
        this.videoAddress = [""];
        //清空封面数组
        this.coverImages = [];
        //清空videoNumber视频数量
        this.videoNumber = [0];
        this.progressStatus = [''];
        this.videoButtons =  [true];
        this.hiddenProgress = [true];
        this.videoNames = [''];
        this.videoUploadPercent = [0];
        this.videoTitles = [''];
        this.$forceUpdate()
      },
      getList() {
        this.listLoading = true;
        fetchGetList(this.listQuery).then(res => {
          this.listLoading = false;
          this.list = res.data.list;
          this.total = res.data.total;
        })
      },
      handleSizeChange(val) {//改变每页显示多少条时触发
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      isTimePointActive(item2, selectPoint) {
        let c = selectPoint.find(item => {
          return item == item2
        })
        if (c || c == 0) {
          return true
        } else {
          return false
        }
      },
      handleCheckHorizontalAllChange(item) {
        if (item.horizontalChecked) {
          //水平方向全部选中
          item.selectPoint.length = 0;
          for (let i = 0; i <= 23; i++) {
            item.selectPoint.push(i)
          }
          //检查垂直方向是否需要选中
          for (let i = 0; i <= 23; i++) {
            this.handleVerticalSelect(i)
          }
        } else {
          item.selectPoint.length = 0;
          this.equipData.openTimeObject[0].timePoint.forEach(item => {
            item.checked = false;
          })
        }
        this.$forceUpdate()
      },
      handleVerticalSelect(i) {
        let tag1 = false;
        for (let item of this.equipData.openTimeObject) {
          if (item.week != '顶部') {
            let tag2 = false;
            for (let item2 of item.selectPoint) {
              if (item2 == i) {
                tag2 = true;
                break;
              }
            }
            if (!tag2) {
              tag1 = true;
              break;
            }
          }
        }
        //代表竖排i需要选中
        this.equipData.openTimeObject[0].timePoint.forEach(item => {
          if (item.value == i) {
            if (!tag1) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          }
        })

      },
      handleCheckVerticalAllChange(item) {
        this.equipData.openTimeObject.forEach(item2 => {
          if (item2.week != '顶部') {
            if (item.checked) {
              for (let i = 0; i < item2.selectPoint.length; i++) {
                if (item2.selectPoint[i] == item.value) {
                  item2.selectPoint.splice(i, 1);
                  break;
                }
              }
              //所在竖排全部选中
              item2.selectPoint.push(item.value)
              //检查横排单选框是否需要选中
              if (item2.selectPoint.length == 24) {
                item2.horizontalChecked = true;
              }
            } else {
              for (let i = 0; i < item2.selectPoint.length; i++) {
                if (item2.selectPoint[i] == item.value) {
                  item2.selectPoint.splice(i, 1);
                  break;
                }
              }
              //横排单选框全部不要选中
              item2.horizontalChecked = false;
            }
          }
        })
        this.$forceUpdate()
      },
      openTimeClick(timePoint, item, event) {
        if (event.target.className == 'time-point-active') {
          //取反
          event.target.className = 'time-point'
          //横竖都不选中
          item.horizontalChecked = false
          for (let i = 0; i < item.selectPoint.length; i++) {
            if (item.selectPoint[i] == timePoint) {
              item.selectPoint.splice(i, 1);
              break;
            }
          }
          //竖排选中判断
          this.handleVerticalSelect(timePoint)

        } else {
          event.target.className = 'time-point-active'
          item.selectPoint.push(timePoint);
          //横排选中判断
          if (item.selectPoint.length == 24) {
            item.horizontalChecked = true;
          }
          //竖排选中判断
          this.handleVerticalSelect(timePoint)
        }
      },
      //上传前回调
      beforeUploadVideo(index, file) {
        let fileSize = file.size / 1024 / 1024 < 50;
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
          this.$message({
            message: '"请上传正确的视频格式"',
            type: 'error',
            duration: 1000
          });
          return false;
        }
        if (!fileSize) {
          this.$message({
            message: '视频大小不能超过50MB',
            type: 'error',
            duration: 1000
          });
          return false;
        }
        this.$set(this.videoNames, index, file.name);
        //隐藏视频上传按钮
        this.$set(this.videoButtons, index, false);
        //显示进度条
        this.$set(this.hiddenProgress, index, false);
        //进度条设置为0%
        this.$set(this.videoUploadPercent, index, 0);
        //进度条颜色改变
        this.$set(this.progressStatus, index, '')
      },
      //进度条
      uploadVideoProcess(index, event, file, fileList) {
        this.videoFlag = true;
        try {
          this.$set(this.videoUploadPercent, index, file.percentage.toFixed(0) * 1);
        } catch (e) {

        }
      },
      //视频上传成功回调
      handleVideoSuccess(index, res, file) {
        //进度条设置为100%
        this.$set(this.videoUploadPercent, index, 100);
        //进度条颜色改变
        setTimeout(() => {
          this.$set(this.progressStatus, index, 'success')
        }, 2000)
        if (res.code == 200) {
          // this.equipData.videoUrlArray.push(res.data.url);
          //清空原来截取的图片
          this.videoInterceptImages[index] = [];
          this.setVideoImg(res.data.url, 0.100, index);
          this.setVideoImg(res.data.url, 5.000, index);
          this.setVideoImg(res.data.url, 10.000, index);
        } else {
          this.$message({
            message: res.Message,
            type: 'error',
            duration: 1000
          });
        }
        this.videoAddress.splice(index,1,res.data.url)
        console.log(res);
      },
      handleImageSuccess(index, res) {
        this.$set(this.coverImages, index, res.data.url);
      },
      setVideoImg(url, time, index) {
        this.$nextTick(() => {
          // 创建视频
          let video = document.createElement('video')
          video.controls = 'controls'
          video.crossOrigin = 'anonymous'
          // 播放地址
          let source = document.createElement('source')
          source.src = url
          source.type = 'video/mp4'
          video.appendChild(source)
          // 这很重要
          video.currentTime = parseFloat(time);
          // 当前帧的数据已加载
          video.addEventListener('loadeddata', () => {
            // 创建画布
            let canvas = document.createElement('canvas')
            canvas.width = video.videoWidth * 0.5
            canvas.height = video.videoHeight * 0.5
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
            // 转码添加
            // let img = document.createElement('img')
            let src = canvas.toDataURL('image/png')
            this.videoInterceptImages[index].push(src);
            // img.src = src
            // 给特定vue节点添加
            // this.$refs['video-img-xxx'].appendChild(img)
          })
        })
      },
      handleDialogConfirm() {
        if (this.equipData.id == null) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //根据是否上传视频判断是否上传封面
            if(!this.judgeIsCover()){
              return
            }
            this.equipData.classificationId = this.equipData.classificationIdArray[this.equipData.classificationIdArray.length - 1]//设置实验室id
            this.equipData.classificationDetailId = this.equipData.classificationIdArray.join(',');//设置实验室id详情
            this.equipData.equipmentUrl = this.equipData.imageUrlsArray.join(',')//轮播图片
            this.equipData.openTime = JSON.stringify(this.equipData.openTimeObject)//开放时间

            this.videoAddress = this.videoAddress.filter(res => {return res != ''});
            this.coverImages = this.coverImages.filter(res => {return res != ''})
            this.videoTitles = this.videoTitles.filter(res => {return res != ''})
            this.equipData.videoUrls = this.videoAddress.join(',');
            this.equipData.coverImages = this.coverImages;
            this.equipData.videoNames =this.videoTitles.join(',');
            this.videoNumber = [];
            for(let count = 0;count < this.videoAddress.length; count++){
              this.videoNumber.push(count);
            }
            this.$forceUpdate()
            fetchCreate(this.equipData).then(res => {
              this.handleDialogConfirmResult(res)
            })
          })
        } else {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //根据是否上传视频判断是否上传封面以及填写视频名称
            if(!this.judgeIsCover()){
              return
            }
            this.equipData.classificationId = this.equipData.classificationIdArray[this.equipData.classificationIdArray.length - 1]//设置实验室id
            this.equipData.classificationDetailId = this.equipData.classificationIdArray.join(',');//设置实验室id详情
            this.equipData.equipmentUrl = this.equipData.imageUrlsArray.join(',')//轮播图片
            this.equipData.openTime = JSON.stringify(this.equipData.openTimeObject)//开放时间

            this.videoAddress = this.videoAddress.filter(res => {return res != ''});
            this.coverImages = this.coverImages.filter(res => {return res != ''})
            this.videoTitles = this.videoTitles.filter(res => {return res != ''})
            this.equipData.videoUrls = this.videoAddress.join(',');
            this.equipData.coverImages = this.coverImages;
            this.equipData.videoNames =this.videoTitles.join(',');
            this.videoNumber = [];
            for(let count = 0;count < this.videoAddress.length; count++){
              this.videoNumber.push(count);
            }
            this.$forceUpdate()
            fetchUpdate(this.equipData).then(res => {
              this.handleDialogConfirmResult(res)
            })
          })
        }
      },
      //判断视频是否上传封面
      judgeIsCover(){
        for (let index in this.videoAddress) {

          if (this.coverImages[index] == ''&& this.videoAddress[index] != '') {
            index = parseInt(index) + 1;
            this.$message({
              message: '请上传第' + index + '视频的封面',
              type: 'error',
              duration: 1000
            });
            return false;
          }
          if (this.videoTitles[index] == '' && this.videoAddress[index] != '') {
            index = parseInt(index) + 1;
            this.$message({
              message: '请填写第' + index + '视频的标题',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        }
        return true;
      },
      handleDialogConfirmResult(res) {
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
      handleUpdate(index, row) {
        //选项卡重置
        this.showStatus = [true, false, false, false];
        this.active = 0;

        this.equipData = JSON.parse(JSON.stringify(row))

        if (this.equipData.videoUrls != "" && this.equipData.videoUrls != null && this.equipData.coverImgs != "" && this.equipData.coverImgs != null) {
          //更新视频参数
          let count = this.equipData.videoUrls.split(',').length;
          console.log(count)
          this.handleInitVideoParam();
          for (let i = 0; i < count; i++) {
            this.videoNumber.splice(i, 1, count)
            this.progressStatus.splice(i, 1, "success")
            this.videoButtons.splice(i, 1, false)
            this.hiddenProgress.splice(i, 1, false)
            this.videoUploadPercent.splice(i, 1, 100)
            this.coverImages.splice(i, 1, this.equipData.coverImgs.split(',')[i])
            this.videoAddress.splice(i, 1, this.equipData.videoUrls.split(',')[i])
            this.videoTitles.splice(i,1,this.equipData.videoNames.split(',')[i]);
          }
          //更新截取帧图片
          console.log(this.videoAddress.length)
          for(let i = 0;i < this.videoAddress.length; i++)
          {
            this.videoInterceptImages[i] = [];
            this.setVideoImg(this.videoAddress[i], 0.100, i);
            this.setVideoImg(this.videoAddress[i], 5.000, i);
            this.setVideoImg(this.videoAddress[i], 10.000, i);
            //更新视频文件名称
            this.videoNames.splice(i,1,this.videoAddress[i].substring(this.videoAddress[i].lastIndexOf("/")+1))
          }
        }else {
          this.handleInitVideoParam();
        }

        if (this.equipData.classificationDetailId != null && this.equipData.classificationDetailId != '') {
          this.$set(this.equipData, 'classificationIdArray', this.equipData.classificationDetailId.split(',').map(item => parseInt(item)));
        } else {
          this.$set(this.equipData, 'classificationIdArray', []);
        }
        this.dialogEditVisible = true
        this.isEdit = true;
        this.equipData.openTimeObject = JSON.parse(this.equipData.openTime);
        if (this.equipData.equipmentUrl != null && this.equipData.equipmentUrl != '') {
          this.$set(this.equipData, 'imageUrlsArray', this.equipData.equipmentUrl.split(','));
        } else {
          this.$set(this.equipData, 'imageUrlsArray', []);
        }
        try {
          this.$refs['equipmentFormBasic'].clearValidate();
          this.$refs['equipmentFormOperationManual'].clearValidate();
          this.$refs['equipmentFormOpenTime'].clearValidate();
          this.$refs['equipmentFormUploadVideo'].clearValidate();
        } catch (e) {

        }
        this.$forceUpdate()
      },
      handleInitVideoParam(){
        //清空视频地址数组
        this.videoAddress = [""];
        //清空封面数组
        this.coverImages = [];
        //清空videoNumber视频数量
        this.videoNumber = [0];
        this.progressStatus = [''];
        this.videoButtons =  [true];
        this.hiddenProgress = [true];
        this.videoNames = [''];
        this.videoUploadPercent = [0];
        this.videoTitles = [''];
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id)
          let params = new URLSearchParams();
          params.append("ids", ids);//后台如果不是用对象接受
          fetchDeleteBatch(params).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 1000
              });
              this.getList();
            } else {
              this.$message({
                message: res.message,
                type: 'error',
                duration: 1000
              });
            }
          })
        });
      },
      handleBatchOperate() {
        if (this.operateType == null) {
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          })
          return
        }
        ;
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的设备',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        ;
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
            case this.operates[1].value:
              this.handleUpdateEquipOpenTimeBatch(ids)
              break;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleDeleteBatch(ids) {
        let params = new URLSearchParams;
        params.append('ids', ids);
        fetchDeleteBatch(params).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '批量删除用户成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          } else {
            this.$message({
              message: '批量删除用户失败',
              type: 'success',
              duration: 1000
            });
          }
        });
      },
      handleUpdateEquipOpenTimeBatch(ids) {
        this.dialogOpenTimeBatchVisible = true;
        // this.equipData = Object.assign({},defaultEquipData);
        this.equipData = JSON.parse(JSON.stringify(defaultEquipData))
        this.equipData.ids = ids;
        this.$forceUpdate()

      },
      handleDialogOpenTimeConfirm() {
        this.equipData.openTime = JSON.stringify(this.equipData.openTimeObject)//开放时间
        this.$forceUpdate()
        fetchUpdateOpenTimeBeach(this.equipData).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: 'success',
            });
            this.dialogOpenTimeBatchVisible = false;
            this.getList();
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
        })
      },
      handleDeleteVideo(index) {
        this.$set(this.videoButtons, index, true);
        this.$set(this.hiddenProgress, index, true);
        this.$set(this.videoTitles,index,'');
        this.$set(this.videoNames,index,'');
        this.$set(this.videoUploadPercent,index,0);
        this.$set(this.progressStatus, index, '');
        if (this.coverImages[index] && this.coverImages[index].length > 5) {
          this.coverImages.splice(index, 1,'')
        }
        if (this.videoAddress[index] && this.videoAddress[index].length > 5) {
          this.videoAddress.splice(index, 1,"")
        }
      }
    },
    filters: {
      formatEquipmentUrl(url) {
        if (url != null && url != '') {
          return '有'
        } else {
          return '无'
        }
      },
      formatStudyVideos(studyVideos) {
        if (studyVideos != null && studyVideos != '' && studyVideos.length > 0) {
          return '有'
        } else {
          return '无'
        }
      }
    },
    components: {
      MultiUpload,
      Tinymce,
      SingleUpload,
      ScrollBar
    },
    computed: {}
  }
</script>

<style scoped>
  .test-5::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .test-5::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
    );
  }
  .test-5::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
  }
  .app-container {
    padding: 25px;
  }

  .operate-container {
    margin-top: 20px;
  }

  .operate-container .btn-add {
    float: right;
  }

  .pagination-container {
    display: inline-block;
    float: right;
    margin-top: 20px;
  }

  .wave {
    display: inline-block;
    line-height: 33px;
    margin-left: -10px;
  }

  .equip-classification {
    display: inline-block;
    margin-left: -140px;
  }

  .equip-address {
    display: inline-block;
  }

  .open-time {
    list-style: none;
  }

  .open-time span {
    font-size: 12px;
  }

  .open-time a {
    display: inline-block;
    background-color: #808080;
    width: 18px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    margin-left: 5px;
    color: #f0f0f0;
    text-align: center;
  }

  .open-time {
    vertical-align: middle;
  }

  .time-point-active {
    background-color: #409EFF !important;
  }

  .el-checkbox {
    margin-right: 5px;
    width: 18px;
    height: 18px;
  }

  .week-top {
    margin-left: 72px;
  }

  .avatar {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  /*上传视频相关*/
  .video-upload {
    width: 598px;
    border: 1px dashed #ccc;
    margin-bottom: 15px;
    position: relative;
  }

  .close {
    position: absolute;
    padding-right: 5px;
    top: 0;
    right: 0;
    font-size: 16px;
    line-height: 16px;
    color: #666;
  }

  .close:hover {
    background-color: #ccc;
  }

  .video-upload-button {
    height: 40px;
    width: 150px;
    margin: 0 auto;
    font-size: 16px !important;
  }

  .video-upload-info {
    display: inline-block;
    margin-left: 38%;
    margin-top: 8%;
    font-size: 12px;
    padding-bottom: 20px;
  }

  .video-upload-info .text-tip {
    padding: 0 10px 10px 0;
    margin-left: -30px;
  }

  .video-progress {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    padding-top: 20px;
  }

  .video-progress:hover a {
    display: block;
  }

  .video-progress img {
    width: 40px;
    height: 30px;
    margin-left: 20px;
    background-image: none;
  }

  .video-progress .progress {
    flex: 1;
    margin-left: 20px;
  }

  .delete-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    line-height: 12px;
  }

  .delete-info a {
    margin-right: 50px;
    display: none;
  }

  .delete-info a:hover {
    color: rgb(0, 161, 214);
  }

  .video-cover {
    padding-bottom: 20px;
  }

  .video-cover .video-cover-title {
    margin-left: 20px;
    font-size: 14px;
  }

  .video-cover .video-cover-image {
    display: flex;
  }

  .video-cover-image .custom-image {
    /*width: 120px;*/
    /*height: 120px;*/
    width: 100px;
    height: 66px;
    margin-top: 20px;
    border: 1px dashed #ccc;
    margin-left: 20px;
    margin-right: 30px;
  }

  .upload-icon {
    width: 40px;
    height: 40px;
    background-image: none;
  }

  .upload-comp {
    height: 100%;
  }

  .custom-image {
    position: relative;
  }

  .upload-icon {
    position: absolute;
    top: 18%;
    left: 32%;
  }

  .cover-tag {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #fff;
    font-size: 12px;
    background-color: #666666;
    line-height: 16px;
  }

  .video-cover-image .intercept-image {
    flex: 1;
    border: 1px solid #ccc;
    margin-right: 20px;
    position: relative;
  }

  .lef-arrow {
    border: solid #ccc;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 7px;
    transform: rotate(135deg);
    top: 40%;
    position: absolute;
    left: -2%;
    background-color: #fff;
  }

  .intercept-image .intercept-image-tip {
    font-size: 12px;
    color: #ccc;
    margin-left: 20px;
  }

  .intercept-image-info {
    display: flex;
    margin-bottom: 20px;
  }

  /*.intercept-image-info .intercept-image-item, .intercept-image-info img {*/
    /*width: 100px;*/
    /*height: 75px;*/
    /*margin-left: 20px;*/
  /*}*/

  .intercept-image-info .intercept-image-item {
    width:100px;
    height:66px;
    overflow: hidden;
    position: relative;
    margin-left: 20px;
  }
  .intercept-image-info .intercept-image-item img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin-left: 20px;
  }

  .video-add {
    width: 598px;
  }

  .video-add-button {
    display: block;
    margin: 10px auto 0;
  }

  .upload-image {
    width: 120px;
    height: 120px;
  }
  .video-title {
    padding-bottom: 20px;
  }
  .video-title span {
    display: block;
    margin-left: 20px;
  }
  .video-title .input-title {
    width: 300px;
    margin-left: 20px;
  }

  /*选项卡相关*/
  .option-tab {
    width: 598px;
    padding-bottom: 30px;
    margin: 0 auto;
  }

  .nextButton {
    display: flex;
    justify-content: center;
  }


  .avatar-uploader-icon {
    line-height: 148px;
    width: 148px;
  }

  .video-resource {
    float: left;
  }

  .video-resource ul {
    list-style: none;
  }

  .video-resource ul li {
    display: inline-block;
    margin-right: 10px;
    border: 1px dashed #ccc;
    width: 148px;
    height: 148px;
    position: relative;
    top: 10px
  }

  .video-resource ul li a:hover {
    background-color: #666666;
  }

  .text-explain {
    font-size: 12px;
    text-align: left;
  }

  .batch-operate-container {
    display: inline-block;
    margin-top: 20px;
  }

  .video-close {
    position: absolute;
    color: red;
    width: 20px;
    height: 20px;
    font-size: 18px;
    line-height: 18px;
    text-align: center;
    right: 0px
  }
  .lbt-tip {
    position: absolute;
    left: -120px;
    top: 25px;
    font-size: 12px;
    color: red;
  }
</style>