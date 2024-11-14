<template>
  <div>

    <el-row align="middle" class="toolbar" justify="start" type="flex">
      <el-col :span="8">
        <go-back-btn></go-back-btn>
        <el-button type="primary" @click="doCreate">创建</el-button>
        <el-button type="success" @click="doScan">快速添加SSH资产</el-button>
        <el-button type="warning" @click="doCheck" :loading="isLoading">机器检查</el-button>

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
      <el-table-column label="Addr" prop="admin_addr"></el-table-column>
      <el-table-column label="Port" prop="admin_port"></el-table-column>
      <el-table-column label="OS" prop="os"></el-table-column>
      <el-table-column label="LAN IP" prop="lan_ip"></el-table-column>
      <el-table-column label="WAN IP" prop="wan_ip"></el-table-column>
      <el-table-column label="Conn Status" prop="conn_status"></el-table-column>
      <el-table-column label="Agent Status" prop="agent_status"></el-table-column>

      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.updated_at)"></span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="Action" width="240">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" title="Web Terminal SSH" type="success" icon="el-icon-s-promotion" @click="doXterm(scope.row)"></el-button>
<!--            <el-button size="mini" title="查看" type="primary" icon="el-icon-view" @click="doView(scope.row)"></el-button>-->
            <el-button size="mini" title="编辑" type="warning" icon="el-icon-edit-outline" @click="doUpdate(scope.row)"></el-button>
            <el-button size="mini" title="删除" type="danger" icon="el-icon-delete" @click="doDelete(scope.row)"></el-button>
<!--            <el-button size="mini" title="安装Agent" type="warning" @click="doAgent(scope.row)" icon="el-icon-set-up"></el-button>-->
            <el-button size="mini" title="SFTP" type="info" @click="doSftp(scope.row)" icon="el-icon-sort"></el-button>
            <el-button size="mini" title="Telnet-sshd" type="warning" @click="doSsdTelnet(scope.row)" icon="el-icon-connection"></el-button>
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

    <df-asset :visible="vAsset" :obj="objAsset" @afterClose="vAsset=false;fetchPage()"></df-asset>
    <df-asset-scan :visible="vScan" :obj="{}" @afterClose="vScan=false;fetchPage()"></df-asset-scan>
  </div>
</template>

<script>
import GoBackBtn from "./misc/GoBackBtn";
import DfAsset from "./misc/DfAsset";
import DfAssetScan from "./misc/DfAssetScan";

export default {
  name: 'ListAsset',
  components: {DfAssetScan, DfAsset, GoBackBtn},
  data() {
    return {
      isLoading: false,
      vAsset: false,
      vScan: false,
      objAsset: {},
      q: {order: 'updated_at:desc', page: 1, size: 15, name: '', email: ''},
      tableData: [],
      total: 0,
    };
  },
  mounted() {
    this.fetchPage();
  },

  methods: {
    doSsdTelnet(row){
      let addr = `${row.admin_addr}:${row.admin_port}`
      this.$http.get("/api/asset-web-telnet", {params: {addr}}).then(webSshURL => {
        if (webSshURL) {
          window.open(webSshURL, '_blank');
        }
      })
    },
    async doCheck() {
      this.isLoading = true
      await this.$http.get("/api/asset-check")
      this.isLoading = false
    },
    doScan() {
      this.vScan = true
    },
    doCreate() {
      this.vAsset = true
      this.objAsset = {}
    },
    doUpdate(row) {
      this.vAsset = true
      this.objAsset = row
    },

    doXterm(row) {
      this.$http.get("/api/asset-web-ssh", {params: {id: row.id}}).then(webSshURL => {
        if (webSshURL) {
          window.open(webSshURL, '_blank');
        }
      })
    },
    doSftp(row) {
      //todo:::::
      this.$http.get("/api/asset-web-sftp", {params: {id: row.id}}).then(webSshURL => {
        if (webSshURL) {
          window.open(webSshURL, '_blank');
        }
      })
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
          .get("/api/asset", {params: this.q})
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
      this.$http.delete(`/api/asset/${row.id}`).then(res => {
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
