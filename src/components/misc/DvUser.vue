<template>

  <el-dialog v-if="obj"
             :title="title"
             :visible="visible"
             @open="doOpen"
             @close="$emit('afterClose')"
  >

    <el-form ref="form" :label-width="$store.state.formLabelWidth" status-icon>
      <el-form-item v-if="user.email" label="用户">
        <el-tag size="mini" type="success" v-text="user.name"></el-tag>
        <el-tag size="mini" type="primary" v-text="user.email"></el-tag>
      </el-form-item>
      <el-form-item v-if="user.account" label="账号">
        <el-tag size="mini" type="success" v-text="user.account"></el-tag>
        <el-tag size="mini" type="primary" v-text="user.id"></el-tag>
      </el-form-item>
      <el-form-item v-if="user.dept_path" label="部门">
        <el-tag size="mini" type="success" v-text="user.dept_path"></el-tag>
      </el-form-item>
      <el-form-item v-if="user.phone" label="手机">
        <el-tag size="mini" type="primary" v-text="user.phone"></el-tag>
      </el-form-item>
      <el-form-item v-if="user.role" label="角色">
        <el-tag size="mini" type="primary" v-text="user.role"></el-tag>
      </el-form-item>
      <el-form-item v-if="user.avatar" label="用户图像">
        <el-image :src="user.avatar" fit="cover" style="width: 100px; height: 100px"></el-image>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script>

export default {
  props: {obj: {type: Object, require: true}, visible: Boolean},
  name: 'DvUser',
  data() {
    return {
      title:"用户详情",
      user: this.obj,
    };
  },
  methods: {
    doOpen() {
      if (this.obj && this.obj.id) {
        this.$http.get(`/api/user/${this.obj.id}`).then(res => {
          if (res) {
            this.user = res
          }
        })
      }
    },
  },
};
</script>
<style scoped>

</style>
