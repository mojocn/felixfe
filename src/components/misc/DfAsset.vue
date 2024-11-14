<template>

  <el-dialog
      :title="title"
      :visible="visible"
      @close="$emit('afterClose')"
      @open="doOpen"
  >

    <el-form ref="form" :model="form" :label-width="$store.state.formLabelWidth" status-icon size="mini">


      <el-form-item label="管理地址" required>
        <el-input v-model="form.admin_addr"></el-input>
      </el-form-item>
      <el-form-item label="管理端口" required>
        <el-input v-model.number="form.admin_port"></el-input>
      </el-form-item>
      <el-form-item label="Host Name">
        <el-input v-model="form.hostname"></el-input>
      </el-form-item>
      <el-form-item label="IP-LAN">
        <el-input v-model="form.lan_ip"></el-input>
      </el-form-item>
      <el-form-item label="IP-WAN">
        <el-input v-model="form.wan_ip"></el-input>
      </el-form-item>
      <el-form-item label="Os">

        <el-radio-group v-model="form.os">
          <el-radio-button v-for="item in osList" :key="item.v" :label="item.label"></el-radio-button>
        </el-radio-group>
      </el-form-item>


      <el-form-item label="管理">
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
        <el-button type="success" @click="doFormSubmit" @keyup.enter.native="doFormSubmit">提交</el-button>
        <el-button type="danger" @click="$emit('afterClose')">关闭</el-button>
      </el-form-item>

    </el-form>

  </el-dialog>

</template>

<script>

const uri = '/api/asset'
const titleCreate = '添加资产'
const titleUpdate = '编辑资产'

export default {
  props: {visible: Boolean, obj: Object},
  name: 'DfAsset',
  data() {

    return {
      title:titleCreate,
      manageAccountList: [],
      form: {
        protocol: 'ssh',
      },
    };
  },
  computed:{
    osList(){
      let meta = this.$store.getters.getMeta
      return meta ? meta.asset_os_list : []
    },
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
      if (this.obj) {
        this.form = this.obj
        this.title = titleUpdate

      } else {
        this.form = {}
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
