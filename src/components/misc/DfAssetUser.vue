<template>

  <el-dialog
      :title="title"
      :visible="visible"
      @close="$emit('afterClose')"
      @open="doOpen"
  >

    <el-form ref="form" :model="form" :label-width="$store.state.formLabelWidth" status-icon size="small">
      <el-form-item label="事由">
        <el-input
            placeholder="请输入内容"
            v-model="form.title">
        </el-input>
      </el-form-item>

      <el-form-item label="SSH账户类型">
        <el-radio-group v-model="form.manage_account_type" @change="atManageAccountTypeChange">
          <el-radio :label="item.v" :key="item.v" v-for="item in manageAccountTypeList">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="sudo类型" v-if="form.manage_account_type === 'user'">
        <el-radio-group v-model="form.user_sudo" @change="atManageAccountTypeChange">
          <el-radio :label="item" :key="item" v-for="item in ['yes','no']">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="SSH帐号" v-if="form.manage_account_type !== 'user'">
        <el-select v-model="form.manage_account_id" placeholder="请选择">
          <el-option
              v-for="item in listManageAccount"
              :key="item.id"
              :label="`${item.for}-${item.protocol}-${item.remark}`"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="授权用户">
        <el-select v-model="form.user_id" placeholder="请选择">
          <el-option
              v-for="item in listUser"
              :key="item.id"
              :label="`${item.name}-${item.email}-${item.account}`"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授权资产">
        <el-select v-model="form.asset_id" placeholder="请选择">
          <el-option
              v-for="item in listAsset"
              :key="item.id"
              :label="`${item.admin_addr}-${item.admin_port}-${item.hostname}-${item.os}`"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="过期时间">
        <el-date-picker
            v-model="form.expired_at"
            type="datetime"
            size="small"
        >
        </el-date-picker>
      </el-form-item>


      <el-form-item label="备注">
        <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.remark">
        </el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="success" @click="doFormSubmit" @keyup.enter.native="doFormSubmit">提交</el-button>
        <el-button type="danger" @click="$emit('afterClose')">关闭</el-button>
      </el-form-item>

    </el-form>

  </el-dialog>

</template>

<script>

import {sizeOfAll} from "../../libs/const";

const uri = '/api/asset-user'
const titleCreate = '创建授权用户资产'
const titleUpdate = '编辑'

export default {
  props: {visible: Boolean, obj: Object},
  name: 'DfAssetUser',
  data() {

    return {
      listUser: [],
      listAsset: [],
      title: titleCreate,
      listManageAccount: [],
      form: {
        title: '',
        remark: '',
        manage_account_id: null,
        manage_account_type: 'user',
        user_sudo: 'yes',
        user_id: null,
        asset_id: null,
        expired_at: '',
      },
    };
  },
  computed: {
    manageAccountTypeList() {
      let meta = this.$store.getters.getMeta
      if (!meta) {
        return []
      }
      return meta.manage_account_type_list;
    }
  },
  methods: {
    atManageAccountTypeChange(v) {
      if (v === 'user') {
        this.form.manage_account_id = null
        return
      } else {
        this.form.user_sudo = null
      }

      this.fetchListManageAccount(v)
    },
    fetchListUser() {
      this.$http.get('/api/user', {params: {size: sizeOfAll, page: 1}}).then(data => {
        this.listUser = data.list
      })
    },
    fetchListAsset() {
      this.$http.get('/api/asset', {params: {size: sizeOfAll, page: 1}}).then(data => {
        this.listAsset = data.list
      })
    },
    fetchListManageAccount(type) {
      this.$http.get('/api/manage-account', {params: {size: 9999, page: 1, for: type}}).then(res => {
        if (res) {
          let {list} = res
          this.listManageAccount = list
        }
      })
    },
    doOpen() {
      this.fetchListAsset()
      this.fetchListUser()

      if (this.obj) {
        this.form = this.obj
        this.title = titleUpdate

      } else {
        this.title = titleCreate
      }
    },
    _post() {
      this.$http.post(uri, this.form).then(res => {
        if (res) {
          this.$emit('afterClose')
        }
      })
    },
    _patch() {
      this.$http.patch(uri, this.form).then(res => {
        if (res) {
          this.$emit('afterClose')
        }
      })
    },
    doFormSubmit() {
      if (this.obj) {
        this._patch()
      } else {
        this._post()
      }
    },
  },
};
</script>
<style scoped>

</style>
