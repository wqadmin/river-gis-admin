<template>
  <a-modal
    :width="550"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleCancel"
    @cancel="handleCancel"
    :mask="false"
    :centered="true"
    class="comment_model custom_modal"
    :bodyStyle="{margin: 0, left:0}"
    :maskClosable="false"
    v-if="visible"
    v-dragModal
  >
    <template slot="closeIcon">
      <a-icon type="close-circle" />
    </template>
    <template slot="title">
      <span>{{name}}信息</span>
    </template>
    <div v-show="show">
      <a-form class="from" id="riskSourceInfoFrom">
        <a-row>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="内部编码">
              <span style="word-break: break-all;">{{list.innerCode}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="风险源类别">
              <span style="word-break: break-all;">{{list.type}}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="准确位置">
              <span style="word-break: break-all;">{{list.accurateLocation}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="首次发现时间">
              <span style="word-break: break-all;">{{list.discoveryTime}}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="面积(m²)">
              <span style="word-break: break-all;">{{list.polygonSize}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道所属">
              <span style="word-break: break-all;">{{list.river}}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div style="text-align: right;margin-top:10px">
        <a-button type="primary" ghost size="small" @click="riskSee">查看详情</a-button>
      </div>
     
      <!-- <a-row>
        <a-col :span="12">
          <p>内部编码: {{list.innerCode}}</p>
          <p>准确位置: {{list.accurateLocation}}</p>
          <p v-show="code == 'riskSource'">面积:{{list.polygonSize}}</p>
        </a-col>
        <a-col :span="12">
          <p>风险源类别: {{list.type}}</p>
          <p>首次发现时间: {{list.discoveryTime}}</p>
          <p>河道所属: {{list.river}}</p>
          <a-button type="primary" ghost size="small" @click="riskSee">查看详情</a-button>
        </a-col>
      </a-row> -->
       <!-- :header="`${data.length} 条状态`" -->
      <a-list
        class="comment-list custom_comment a-list"
        itemLayout="horizontal"
        :dataSource="data"
        size="small"
        style
      >
        <div slot="header" class="a-list-header">
          <div>{{data.length}} 条状态</div>
          <a-button type="primary"  @click="renewClick('1')" v-show="jurisdiction" size="small">更新风险状态</a-button>
        </div>
        <a-list-item slot="renderItem" slot-scope="item" class="comment_list" id="listItem">
          <a-comment :avatar="item.avatar">
            <div slot="author" class="list_item_title">
              <div>
                <div>{{item.author}}</div>
                <div style="color: #ccc;">{{item.datetime}}</div>
              </div>
              <a-popconfirm
                title="确定删除吗？"
                @confirm="confirmDelete(item.id)"
                @cancel="cancelDelete"
                v-show="jurisdiction"
              >
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a-button size="small">删除</a-button>
              </a-popconfirm>
            </div>
            <div class="comment_level">
              <p
                v-show="code == 'riskSource'"
                :class="{'danger_level0': item.level == 'three', 'danger_level1': item.level == 'two','danger_level2': item.level == 'one','danger_level3': item.level == 'four'}"
              >{{item.dangerDescribe}}</p>
              <span>{{item.dangerContent}}</span>
            </div>
            <!-- <template slot="datetime">
              <div class="comment_title">
                <a-tooltip slot="datetime" :title="item.datetime">
                  <span style="">{{item.datetime}}</span>
                </a-tooltip>
                <a-popconfirm
                  title="确定删除吗？"
                  @confirm="confirmDelete(item.id)"
                  @cancel="cancelDelete"
                  v-show="jurisdiction"
                >
                  <a-icon slot="icon" type="question-circle-o" style="color: red" />
                  <a-button size="small">删除</a-button>
                </a-popconfirm>
              </div>
            </template> -->
            <p slot="content" style="margin-top:10px">{{'管理建议: ' + item.comment}}</p>
            <div class="comment_img" v-show="item.imgList.length > 0">
              <viewer :images="item.imgList">
                <img v-for="img in item.imgList" :key="img" :src="img" :alt="img" />
              </viewer>
            </div>
          </a-comment>
        </a-list-item>
      </a-list>
    </div>
    <div v-show="show_type">
      <a-form>
        <a-form-item label="是否存在" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select defaultValue="yes" v-model="drawList.exist">
            <a-select-option value="yes">是</a-select-option>
            <a-select-option value="no">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="等级"
          v-show="code == 'riskSource'"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-select defaultValue="one" v-model="drawList.level">
            <a-select-option value="one"> <div style="width: 10px;height: 10px;background: #EE1C1D;display: inline-block;border-radius: 5px;"></div> Ⅰ级</a-select-option>
            <a-select-option value="two"><div style="width: 10px;height: 10px;background: #FF8300;display: inline-block;border-radius: 5px;margin-right:5px"></div>Ⅱ级</a-select-option>
            <a-select-option value="three"><div style="width: 10px;height: 10px;background: #FFFC01;display: inline-block;border-radius: 5px;margin-right:5px"></div>Ⅲ级</a-select-option>
            <a-select-option value="four"><div style="width: 10px;height: 10px;background: #0D92EE;display: inline-block;border-radius: 5px;margin-right:5px"></div>Ⅳ级</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="管理建议" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea placeholder="请输入" :rows="4" v-model="drawList.comment" />
        </a-form-item>
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" label="图片">
          <el-upload
            class="upload-demo"
            ref="upload"
            :data="drawList"
            name="pic"
            :headers="headers"
            action="/server/data/admin/mapdraw/comment/save"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
          >
            <a-button type="primary" icon="plus">添加</a-button>
          </el-upload>
          <viewer v-for="index in attachmentJpg" :key="index">
            <img :src="index" alt style="height:70px;" />
          </viewer>
        </a-form-item>
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" label="操作">
          <div>
            <a-button @click="renewClick('2')" style="margin-right:20px">取消</a-button>
            <a-button type="primary" @click="saveClick">保存</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  riskDetails,
  dischargeDetails,
  floatageDetails,
  commentMapdraw,
  commentMapdrawSave,
  commentRemove
} from '@/api/login'
export default {
  data() {
    return {
      labelCol: {
        span: 9 
      },
      wrapperCol: {
        span: 13
      },
      jurisdiction: this.$store.state.operationPermission[1], //权限
      name: '',
      fileList: [],
      code: '',
      file: false,
      attachmentJpg: [],
      show: true,
      show_type: false,
      visible: false,
      confirmLoading: false,
      list: {},
      drawList: {
        id: '',
        drawId: '',
        comment: '',
        exist: '',
        level: 'one'
      },
      id: '',
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
      },
      data: [
        // {
        //   author: '李白',
        //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //   content: '管理建议: 持续监督.',
        //   dangerLevel: 2,
        //   dangerDescribe: 'II 级',
        //   dangerContent: '存在',
        //   datetime: '2019-10-29',
        //   imgList: [
        //     {
        //       id: 0,
        //       url: require('../../../../public/avatar2.jpg'),
        //       alt: '风险图片'
        //     },
        //     {
        //       id: 1,
        //       url: require('../../../../public/avatar2.jpg'),
        //       alt: '风险图片'
        //     },
        //     {
        //       id: 2,
        //       url: require('../../../../public/avatar2.jpg'),
        //       alt: '风险图片'
        //     },
        //     {
        //       id: 3,
        //       url: require('../../../../public/avatar2.jpg'),
        //       alt: '风险图片'
        //     }
        //   ]
        // },
        // {
        //   author: '王昭君',
        //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //   content: '管理建议: 暂无风险.',
        //   dangerLevel: 0,
        //   dangerDescribe: '0 级',
        //   dangerContent: '不存在',
        //   datetime: '2019-10-01',
        //   imgList: [
        //     {
        //       id: 0,
        //       url: require('../../../../public/avatar2.jpg'),
        //       alt: '风险图片'
        //     },
        //     {
        //       id: 1,
        //       url: require('../../../../public/avatar2.jpg'),
        //       alt: '风险图片'
        //     }
        //   ]
        // }
      ]
    }
  },
  mounted() {},
  computed: {},
  methods: {
    moment,
    riskInfo(row) {
      this.code = row.target.options.code
      this.id = row.target.options.id
      this.drawList.drawId = row.target.options.id
      if (row.target.options.code == 'riskSource') {
        this.name = '风险源'
        riskDetails(row.target.options.id).then(res => {
          let arr = res.data
          arr.discoveryTime = moment(arr.discoveryTime).format('YYYY-MM-DD')
          arr.type = arr.type.name
          if (arr.river != undefined) {
            arr.river = arr.river.name
          }
          // if (arr.level.code =='one') {
          //   arr.dangerDescribe ='Ⅰ 级'
          // }
          // if (arr.level.code =='two') {
          //   arr.dangerDescribe ='Ⅱ 级'
          // }
          // if (arr.level.code =='three') {
          //   arr.dangerDescribe ='Ⅲ 级'
          // }
          // if (arr.level.code =='four') {
          //   arr.dangerDescribe ='Ⅳ 级'
          // }
          this.list = arr
        })
      }
      if (row.target.options.code == 'discharge') {
        this.name = '排口'
        dischargeDetails(row.target.options.id).then(res => {
          let arr = res.data
          arr.discoveryTime = moment(arr.discoveryTime).format('YYYY-MM-DD')
          if (arr.type) {
            arr.type = arr.type.name
          }
          if (arr.river) {
            arr.river = arr.river.name
          }

          this.list = arr
        })
      }
      if (row.target.options.code == 'floatage') {
        floatageDetails(row.target.options.id).then(res => {
          let arr = res.data
        })
      }
      this.visible = true
      this.getCommentMapdraw()
    },
    getCommentMapdraw() {
      commentMapdraw(this.id).then(res => {
        res.data.data.forEach(v => {
          v.imgList = Object.values(v.pics)
          v.datetime = moment(v.timeCreated).format('YYYY-MM-DD')
          if (v.level != undefined) {
            if (v.level.code == 'one') {
              v.dangerDescribe = 'Ⅰ 级'
            }
            if (v.level.code == 'two') {
              v.dangerDescribe = 'Ⅱ 级'
            }
            if (v.level.code == 'three') {
              v.dangerDescribe = 'Ⅲ 级'
            }
            if (v.level.code == 'four') {
              v.dangerDescribe = 'Ⅳ 级'
            }
            v.level = v.level.code
          }

          if (v.exist == true) {
            v.dangerContent = '存在'
          } else {
            v.dangerContent = '不存在'
          }
          v.avatar = require('../img/head.png')
          if (v.creator) {
            v.author = v.creator.name
          }
        })
        this.data = res.data.data
      })
    },
    riskSee() {
      this.visible = false
      if (this.code == 'riskSource') {
        this.$parent.sourceRiskView(this.id, 'riskSource')
      }
      if (this.code == 'discharge') {
        this.$parent.sourceRiskView(this.id, 'discharge')
      }
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    saveClick() {
      console.log(this.drawList)
      commentMapdrawSave(this.drawList).then(res => {
        this.drawList.id = res.data.id
        this.$refs.upload.submit()
        this.$message.success('保存成功')
        this.drawList.id = ''
        this.getCommentMapdraw()
        this.show_type = false
        this.show = true
      })
    },
    handleSuccess(response, file, fileList) {
      this.attachmentJpg = []
      this.drawList.comment = ''
      this.drawList.id = ''
      this.drawList.exist = ''
      this.drawList.level = ''
      this.fileList = []
      this.getCommentMapdraw()
    },
    handleChange(file, fileList) {
      this.fileList = fileList
      this.attachmentJpg.push(URL.createObjectURL(file.raw))
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    renewClick(row) {
      this.attachmentJpg = []
      this.drawList.comment = ''
      this.drawList.exist = ''
      this.drawList.level = ''
      this.fileList = []
      if (row == '1') {
        this.show = false
        this.show_type = true
      } else {
        this.show = true
        this.show_type = false
      }
    },
    confirmDelete(id) {
      console.log(id)
      commentRemove(id).then(res => {
        this.$message.success('删除成功')
        this.getCommentMapdraw()
      }).catch(err => {
        this.$message.error(err.response.data.message)
      })
    },
    cancelDelete() {},
    handleCancel() {
      this.show = true
      this.show_type = false
      this.drawList.comment = ''
      this.drawList.id = ''
      this.drawList.exist = ''
      this.drawList.level = ''
      this.list = {}
      this.data = []
      this.fileList = []
      this.attachmentJpg = []
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
p {
  margin: 0 10px 0 0;
  text-align: justify;
}
.comment_level {
  p {
    display: inline-block;
    background-color: red;
    font-size: 12px;
    width: 40px;
    line-height: 20px;
    text-align: center;
    border-radius: 4px;
    color: white;
    margin: 0 6px 6px 0;
  }
  .danger_level0 {
    background-color: #f5e50b;
  }
  .danger_level1 {
    background-color: #faad14;
  }
  .danger_level2 {
    background-color: #f5222d;
  }
  .danger_level3 {
    background-color: #0e7dfd;
  }
  span {
    font-size: 14px;
    color: #333;
  }
}
.comment_img {
  display: flex;
  display: -webkit-flex;
  // justify-content: space-between;
  // -webkit-justify-content: space-between;
  flex-wrap: wrap;
  height: 100px;
  overflow-y: scroll;
  img {
    width: 80px;
    height: 80px;
    margin: 0 10px 10px 0;
  }
  img:nth-last-child(1) {
    margin: 0;
  }
}
.comment_title {
  width: 396px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.a-list {
  max-height: 400px;
  overflow-y: scroll;
}
.a-list::-webkit-scrollbar {
  display: none;
}
.comment_img::-webkit-scrollbar {
  display: none;
}
.a-list-header{
  display: flex;
  justify-content:space-between
}
.list_item_title{
  width:454px;
  padding:0;
  margin:0;
  color:#000000;
  height:32px;
  display:flex;
  justify-content:space-between;
  align-items: center;
}
</style>
