<template>

  <el-dialog v-if="obj"
             :title="title"
             :visible="visible"
             @open="doOpen"
             @close="$emit('afterClose')"
  >

    <el-form ref="form" :label-width="$store.state.formLabelWidth" status-icon>
      <el-form-item v-if="ins.admin_addr" label="管理地址">
        <el-tag size="mini" type="success" v-text="ins.admin_addr"></el-tag>
      </el-form-item>
      <el-form-item v-if="ins.os" label="操作系统">
        <el-tag size="mini" type="success" v-text="ins.os"></el-tag>
      </el-form-item>

    </el-form>
  </el-dialog>

</template>

<script>

export default {
  props: {obj: {type: Object, require: true}, visible: Boolean},
  name: 'DvAsset',
  data() {
    return {
      title:"资产详情",
      ins: this.obj,
    };
  },
  methods: {
    doOpen() {
      if (this.obj && this.obj.id) {
        this.$http.get(`/api/asset/${this.obj.id}`).then(res => {
          if (res) {
            this.ins = res
          }
        })
      }
    },
  },
};
</script>
<style scoped>

</style>
