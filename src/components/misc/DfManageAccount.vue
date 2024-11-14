<template>

  <el-dialog
      :title="title"
      :visible="visible"
      @close="$emit('afterClose')"
      @open="doOpen"
  >


    <el-form ref="form" :model="form" :label-width="$store.state.formLabelWidth" status-icon size="mini">
      <el-form-item label="For" required>
        <el-radio-group v-model="form.for">
          <el-radio label="admin"></el-radio>
          <el-radio label="share"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="协议" required>
        <el-radio-group v-model="form.protocol">
          <el-radio label="ssh"></el-radio>
          <el-radio label="rdp"></el-radio>
          <el-radio label="vnc"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" required>
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="用户名" required>
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="私钥">
        <el-input v-model="form.private_key" type="textarea" maxlength="512" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="私钥密码" prop="private_key_password">
        <el-input v-model="form.private_key_password"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="success" @click="doFormSubmit" @keyup.enter.native="doFormSubmit">提交</el-button>
        <el-button type="danger" @click="$emit('afterClose')">关闭</el-button>
      </el-form-item>

    </el-form>

  </el-dialog>

</template>

<script>
const uri = '/api/manage-account'
const titleCreate = '添加管理账号'
const titleUpdate = '编辑管理账号'

export default {
  props: {visible: Boolean, obj: Object},
  name: 'DfManageAccount',
  data() {

    return {
      title: '自残添加',
      form: {
        protocol: 'ssh',
      },
    };
  },
  methods: {

    doOpen() {
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
