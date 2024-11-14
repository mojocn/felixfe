<template>

  <el-dialog
      :title="title"
      :visible="visible"
      @close="$emit('afterClose')"
      @open="doOpen"
  >


    <el-form v-model="form" :label-width="$store.state.formLabelWidth" status-icon ref="form">
      <el-form-item label="Assets">
        <el-transfer
            style="text-align: left; display: inline-block"

            v-model="form.selected_asset_ids"
            filterable
            :props="{
                  key: 'id',
                  label: 'admin_addr'
                }"
            :titles="['Assets', 'Selected Assets']"
            @change="atChangeTransfer"
            :data="assetList">
        </el-transfer>


      </el-form-item>


      <el-form-item label="管理帐号SSH">
        <el-select v-model="form.manage_account_id" placeholder="请选择">
          <el-option
              v-for="item in manageAccountList"
              :key="item.id"
              :label="`${item.for}-${item.protocol}-${item.remark}`"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="Script">
        <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="form.shell_script">
        </el-input>

      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="doCreate">Run</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>


  </el-dialog>

</template>

<script>

import {Message} from "element-ui";

const titleCreate = '执行Shell脚本'

export default {
  props: {visible: Boolean, obj: Object},
  name: 'DfScriptExec',
  data() {

    return {
      title: titleCreate,
      form: {
        selected_asset_ids: [],
        manage_account_id: 2,
        shell_script: 'whoami;\r\n pwd;',
      },
      q: {page: 1, size: 9999},
      assetList: [],
      manageAccountList: [],
      total: 0,
    };
  },
  methods: {

    fetchAdminAccount() {
      this.$http.get('/api/manage-account', {params: {size: 9999, page: 1}}).then(res => {
        if (res) {
          let {list} = res
          this.manageAccountList = list
        }
      })
    },
    doCreate() {
      for (const selectedAssetId of this.form.selected_asset_ids) {
        let obj = {asset_id: selectedAssetId, manage_account_id: this.form.manage_account_id, shell_script: this.form.shell_script}
        this.$http.post("/api/script-exec", obj).then(res => {
          if (res) {
            Message.error(res)
          }
        })
      }
      this.$emit("afterClose")
      this.$refs.form.resetFields()
    },
    atChangeTransfer() {

    },
    fetchAssets() {
      this.$http
          .get("/api/asset", {params: this.q})
          .then(resp => {
            if (resp) {
              let {page, size, list, total} = resp
              this.q.page = page
              this.q.size = size
              this.assetList = list
              this.total = total
            }
          })
    },


    doOpen() {
      this.fetchAdminAccount()
      this.fetchAssets()
      this.title = titleCreate
    },


  },
};
</script>
<style scoped>

</style>
