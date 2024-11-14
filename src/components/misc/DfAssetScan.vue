<template>

  <el-dialog
      :title="title"
      :visible="visible"
      @close="$emit('afterClose')"
      @open="doOpen"
  >

    <el-form ref="form" :model="form" :label-width="$store.state.formLabelWidth" status-icon >


      <el-form-item label="CIDR" required>
        <el-input v-model="form.cidr"></el-input>
      </el-form-item>
      <el-form-item label="管理端口" required>
        <el-input v-model="form.port"></el-input>
      </el-form-item>



      <el-form-item label="SSH管理帐号">
        <el-select v-model="form.manage_account_id" placeholder="请选择">
          <el-option
              v-for="item in manageAccountList"
              :key="item.id"
              :label="`${item.for}-${item.protocol}-${item.remark}`"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="success" @click="doFormSubmit" @keyup.enter.native="doFormSubmit">扫描</el-button>
        <el-button type="danger" @click="$emit('afterClose')">关闭</el-button>
      </el-form-item>

    </el-form>

  </el-dialog>

</template>

<script>

const uri = '/api/asset-scan'
const titleCreate = '扫描网段'

export default {
  props: {visible: Boolean, obj: Object},
  name: 'DfAssetScan',
  data() {

    return {
      title:titleCreate,
      manageAccountList: [],
      form: {
        protocol: 'ssh',
      },
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
    doOpen() {
      this.fetchAdminAccount()
      this.title = titleCreate
      this.form = {cidr:"10.13.84.0/24",port:22}
    },

    doFormSubmit() {
      this.$http.post(uri, this.form).then(res => {
        if (res) {
          this.$emit('afterClose')
        }
      })
    },
  },
};
</script>
<style scoped>

</style>
