<template>
  <el-dialog
      :title="title"
      :visible="visible"
      @close="$emit('afterClose')"
      @open="doOpen"
  >
    <el-form ref="form" :model="form" label-width="120px" status-icon>
      <el-form-item label="账号" prop="account">
        <el-tag size="mini" type="primary" v-text="form.name"></el-tag>
      </el-form-item>
      <el-form-item label="Email">
        <el-tag v-if="form.email" size="mini" type="primary" v-text="form.email"></el-tag>
        <el-link v-if="!form.email" href="https://account.mojotv.cn" type="danger">请到account.mojotv.cn设置邮箱</el-link>
      </el-form-item>
      <!--      <el-form-item label="手机号码">-->
      <!--        <el-input v-model="form.phone" clearable prefix-icon="el-icon-phone"></el-input>-->
      <!--      </el-form-item>-->

      <el-form-item label="SSH公钥" prop="ssh_public_key">
        <el-input v-model.trim="form.ssh_public_key" clearable prefix-icon="el-icon-tickets" rows="7"
                  type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="doUpdatePerson">提交</el-button>
        <el-button type="danger" @click="$emit('afterClose')">关闭</el-button>
      </el-form-item>
    </el-form>


  </el-dialog>

</template>

<script>

export default {
  name: 'DfUser',
  props: {visible: Boolean, title: String},
  data() {
    return {
      form: {ssh_public_key: ''},
    };
  },

  methods: {
    doOpen() {
      this.$http.get('/api/user-info').then(res => {
        if (res) {
          this.form = res
        }
      })
    },

    doUpdatePerson() {
      this.$http.patch('/api/user', this.form).then(res => {
        if (res) {
          this.$emit('afterClose')
        }
      })
    }
  },
};
</script>

<style scoped>

</style>