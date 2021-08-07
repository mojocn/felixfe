<template>

  <div id="app">

    <el-table :data="tableData" border style="width: 100%" stripe>

      <el-table-column prop="name" label="name">
      </el-table-column>
      <el-table-column prop="value" label="value">
      </el-table-column>
      <el-table-column prop="def" label="Default">
      </el-table-column>
      <el-table-column prop="desc" label="Desc">
      </el-table-column>


      <el-table-column fixed="right" label="Action" width="240">
        <template slot-scope="scope">
          <el-link
              title="edit config"
              @click="showForm(scope.row)"
              type="success"
              size="mini"
              icon="el-icon-edit"
          ></el-link>
        </template>
      </el-table-column>
    </el-table>


    <!--edit-->
    <el-dialog title="ssh" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Name">
          <el-input v-model="form.name" autocomplete="off" disabled></el-input>
        </el-form-item>

        <el-form-item label="Default">
          <el-input v-model="form.def" autocomplete="off" disabled></el-input>
        </el-form-item>

        <el-form-item label="Desc">
          <el-input v-model="form.desc" autocomplete="off" disabled></el-input>
        </el-form-item>

        <el-form-item label="Value">
          <el-input v-model="form.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateConfig">Submit</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>

import axios from 'axios';

export default {
  name: 'app',
  data() {
    return {
      formLabelWidth: "120",
      dialogFormVisible: false,
      total: 0,
      page: 1,
      size: 10,
      tableData: [],
      form: {},
      q: "",
    };
  },
  mounted() {
    this.fetchConfig();
  },
  created() {
  },
  methods: {

    fetchConfig() {
      let q = ''
      axios.get("api/config", {params: {q}}).then(({status, data}) => {
            if (status === 200) {
              this.tableData = data
            }
          }
      )
    },
    showForm(row) {
      this.form = row;
      this.dialogFormVisible = true
    },
    updateConfig() {
      axios.patch("api/config", this.form).then(({status, data}) => {
        if (status !== 200) {
          this.$message.success(data);
        } else {
          this.dialogFormVisible = false;
          this.fetchConfig()
        }
      })
    },
  }
};
</script>
<style scoped>


</style>
