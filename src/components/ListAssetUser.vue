<template>
  <div>

    <el-row align="middle" class="toolbar" justify="start" type="flex">
      <el-col :span="4">
        <go-back-btn></go-back-btn>
        <el-button type="primary" @click="doCreate">创建</el-button>

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
      <el-table-column label="title" prop="title"></el-table-column>

      <el-table-column label="User">
        <template slot-scope="scope">
          <el-link type="primary" v-text="scope.row.user.name" @click="dvUserV= true;dvUserObj=scope.row.user"></el-link>
        </template>
      </el-table-column>

      <el-table-column label="Asset">
        <template slot-scope="scope">
          <el-link type="primary" v-text="scope.row.asset.admin_addr" @click="dvAssetV= true;dvAssetObj=scope.row.asset"></el-link>
        </template>
      </el-table-column>


      <el-table-column label="Manage Account">
        <template slot-scope="scope" v-if="scope.row.manage_account">
          <el-link type="primary" v-text="scope.row.manage_account.user" @click="dvManageAccountV= true;dvManageAccountObj=scope.row.manage_account"></el-link>
        </template>
      </el-table-column>


      <el-table-column label="status" prop="status"></el-table-column>
      <el-table-column label="expired_at">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.expired_at)"></span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.updated_at)"></span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="Action">
        <template slot-scope="scope">
          <el-button-group>

            <el-button size="mini" title="Web Terminal SSH" type="success" icon="el-icon-s-promotion"
                       @click="doXterm(scope.row)"></el-button>
            <el-button size="mini" title="查看" type="primary" icon="el-icon-view" @click="doView(scope.row)"></el-button>
            <el-button size="mini" title="编辑" type="warning" icon="el-icon-edit-outline"
                       @click="doUpdate(scope.row)"></el-button>
            <el-button size="mini" title="删除" type="danger" icon="el-icon-delete"
                       @click="doDelete(scope.row)"></el-button>
            <el-button size="mini" type="info" @click="doSftp(scope.row)">SFTP</el-button>
            <el-button size="mini" type="info" @click="doGuacamole(scope.row,'vnc')">VNC</el-button>
            <el-button size="mini" type="info" @click="doGuacamole(scope.row,'rdp')">RDP</el-button>
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

    <df-asset-user :visible="vAssetUser" :obj="objAssetUser" @afterClose="vAssetUser=false;fetchPage()"></df-asset-user>

    <dv-user :obj="dvUserObj" :visible="dvUserV" @afterClose="dvUserV=false"></dv-user>
    <dv-asset :obj="dvAssetObj" :visible="dvAssetV" @afterClose="dvAssetV=false"></dv-asset>
    <dv-manage-account :obj="dvManageAccountObj" :visible="dvManageAccountV" @afterClose="dvManageAccountV=false"></dv-manage-account>

  </div>
</template>

<script>
import GoBackBtn from './misc/GoBackBtn';
import DfAssetUser from './misc/DfAssetUser';
import DvUser from "./misc/DvUser";
import DvAsset from "./misc/DvAsset";
import DvManageAccount from "./misc/DvManageAccount";

export default {
  name: 'ListAssetUser',
  components: {DvAsset, DvUser, DfAssetUser, GoBackBtn, DvManageAccount},
  data() {
    return {
      dvUserObj: {},
      dvUserV: false,

      dvAssetObj: {},
      dvAssetV: false,

      dvManageAccountObj: {},
      dvManageAccountV: false,

      vAssetUser: false,
      objAssetUser: {},
      q: {order: 'updated_at:desc', page: 1, size: 15},
      tableData: [],
      total: 0,
    };
  },
  mounted() {
    this.fetchPage();
  },

  methods: {

    doCreate() {
      this.vAssetUser = true
      this.objAssetUser = null
    },
    doUpdate(row) {
      this.vAssetUser = true
      this.objAssetUser = row
    },


    doGuacamole(row){
      this.$http.get("/api/asset-web-guacamole", {params: {id: row.id}}).then(webSshURL => {
        if (webSshURL) {
          window.open(webSshURL, '_blank');
        }
      })


    },
    doXterm: function (row) {
      //todo:::::
      this.$http.get("/api/asset-web-ssh", {params: {id: row.id}}).then(webSshURL => {
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
          .get("/api/asset-user", {params: this.q})
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
      this.$http.delete(`/api/asset-user/${row.id}`).then(res => {
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
