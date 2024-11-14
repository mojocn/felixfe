<template>
  <div>

    <el-row align="middle" class="toolbar" justify="start" type="flex">
      <el-col :span="4">
        <go-back-btn></go-back-btn>
        <el-button type="primary" @click="doRunShellScript">执行脚本</el-button>

      </el-col>
      <el-col :span="20" class="search-bar">
        <el-date-picker
            v-model="q.created_at"
            :default-time="['00:00:00', '23:59:29']"
            end-placeholder="结束日期"
            range-separator="至"
            size="small"
            start-placeholder="开始日期"
            @change="fetchPage"
            type="daterange">
        </el-date-picker>

        <el-input v-model.trim="q.name"
                  clearable
                  placeholder="模糊搜索用户名（中文）"
                  prefix-icon="el-icon-search"
                  size="small"
                  @change="fetchPage">
        </el-input>
        <el-input v-model.trim="q.email"

                  clearable
                  placeholder="模糊搜索邮箱"
                  prefix-icon="el-icon-search"
                  size="small"
                  @change="fetchPage">
        </el-input>


        <el-button icon="el-icon-search" size="small"
                   title="搜索/刷新按钮"
                   type="primary"
                   @click="fetchPage">
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe>
      <el-table-column fixed label="ID" prop="id" width="120"></el-table-column>
      <el-table-column label="资产管理IP">
        <template slot-scope="scope">
          <span v-text="scope.row.asset.admin_addr"></span>
        </template>
      </el-table-column>
      <el-table-column label="管理帐号">
        <template slot-scope="scope">
          <span v-text="scope.row.manage_account.user"></span>
        </template>
      </el-table-column>

      <el-table-column label="shell_script" prop="shell_script"></el-table-column>
      <el-table-column label="exec_log" prop="exec_log"></el-table-column>
      <el-table-column label="exec_run_at" prop="exec_end_ts"></el-table-column>
      <el-table-column label="exec_end_at" prop="exec_end_ts"></el-table-column>
      <el-table-column label="exec_status" prop="exec_status"></el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.updated_at)"></span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="Action">
        <template slot-scope="scope">
          <el-button-group>

            <el-button size="mini" title="执行" type="success" icon="el-icon-refresh-right"
                       :disabled="scope.row.exec_status === 'ok'"
                       @click="doExec(scope.row)"></el-button>

            <el-button size="mini" title="查看" type="primary" icon="el-icon-view" @click="doView(scope.row)"></el-button>

            <el-button size="mini" title="编辑" type="warning" icon="el-icon-edit-outline"
                       :disabled="scope.row.exec_status === 'ok'"
                       @click="doUpdate(scope.row)"></el-button>
            <el-button size="mini" title="删除" type="danger" icon="el-icon-delete"
                       :disabled="scope.row.exec_status === 'ok'"
                       @click="doDelete(scope.row)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
        :current-page="q.page"
        :page-size="q.size"
        :page-sizes="[10,15, 30, 45, 60]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"

        @size-change="sizeChange"
        @current-change="pageChange">
    </el-pagination>

    <df-script-exec :visible="vAnsibleRun" :obj="{}" @afterClose="vAnsibleRun=false;fetchPage()"></df-script-exec>
  </div>
</template>

<script>
import GoBackBtn from "@/components/misc/GoBackBtn";
import DfScriptExec from "@/components/misc/DfScriptExec";

export default {
  name: 'ListScriptExec',
  components: {DfScriptExec, GoBackBtn},
  data() {
    return {
      vAnsibleRun: false,
      q: {order: 'updated_at:desc', page: 1, size: 15, name: '', email: ''},
      tableData: [],
      total: 0,
    };
  },
  mounted() {
    this.fetchPage();
  },

  methods: {
    doExec(row) {
      this.$http.put(`/api/script-exec/${row.id}`).then(res => {
        if (res) {
          this.$message.success("ok")
        }
      })
    },
    doRunShellScript() {
      this.vAnsibleRun = true
    },
    doUpdate(row) {
      this.vAnsibleRun = true
      this.objAsset = row
    },
    doView() {
    },
    pageChange(val) {
      this.q.page = val;
      this.fetchPage()
    },
    sizeChange(val) {
      this.q.page = 1;
      this.q.size = val;
      this.fetchPage()
    },
    fetchPage() {
      this.$http
          .get("/api/script-exec", {params: this.q})
          .then(resp => {
            if (resp) {
              let {page, size, list, total} = resp
              this.q.page = page
              this.q.size = size
              this.tableData = list
              this.total = total
            }
          })
    },

    doDelete(row) {
      this.$http.delete(`/api/script-exec/${row.id}`).then(res => {
        if (res) {
          this.fetchPage();
        }
      })
    },
  }
};
</script>
<style scoped>


</style>
