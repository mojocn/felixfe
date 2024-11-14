<template>
  <div>

    <el-row align="middle" class="toolbar" justify="start" type="flex">
      <el-col :span="4">
        <go-back-btn></go-back-btn>

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
      <el-table-column label="as" prop="as"></el-table-column>
      <el-table-column label="asset_id" prop="asset_id"></el-table-column>
      <el-table-column label="user_id" prop="user_id"></el-table-column>
      <el-table-column label="start_at" prop="start_at"></el-table-column>
      <el-table-column label="end_at" prop="end_at"></el-table-column>
      <el-table-column label="file_path" prop="file_path"></el-table-column>
      <el-table-column label="会话时长" prop="file_path"></el-table-column>
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

            <el-button size="mini" title="删除" type="danger" icon="el-icon-delete"
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

    <df-asset :visible="vAsset" :obj="objAsset" @afterClose="vAsset=false;fetchPage()"></df-asset>
  </div>
</template>

<script>
import GoBackBtn from "@/components/misc/GoBackBtn";
import DfAsset from "@/components/misc/DfAsset";

export default {
  name: 'ListTerminalLog',
  components: {  DfAsset, GoBackBtn},
  data() {
    return {
      row: null,
      vAsset: false,
      vTerm: false,
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


    doView(row) {
      let routeData = this.$router.resolve({name: 'play', params: {id: row.id}});
      window.open(routeData.href, '_blank');
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
          .get("/api/terminal-log", {params: this.q})
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
      this.$http.delete(`/api/terminal-log/${row.id}`).then(res => {
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
