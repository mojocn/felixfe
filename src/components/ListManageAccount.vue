<template>
  <div>

    <el-row align="middle" class="toolbar" justify="start" type="flex">
      <el-col :span="4">
        <go-back-btn></go-back-btn>
        <el-button type="primary" @click="doCreateAsset">创建</el-button>

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
      <el-table-column fixed label="ID" prop="id" :width="$store.state.widthTableColId"></el-table-column>

      <el-table-column label="用途" prop="for"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="协议" prop="protocol"></el-table-column>
      <el-table-column label="用户" prop="user"></el-table-column>
      <el-table-column label="密码" prop="password"></el-table-column>
      <el-table-column label="私钥" prop="private_key"></el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.updated_at)"></span>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" title="编辑" type="success" icon="el-icon-edit-outline" @click="doUpdate(scope.row)"></el-button>
            <el-button size="mini" title="删除" type="danger" icon="el-icon-delete" @click="doDelete(scope.row)"></el-button>
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

    <df-manage-account :visible="vDf" :obj="obj" @afterClose="vDf=false;fetchPage()"></df-manage-account>
  </div>

</template>

<script>
import GoBackBtn from "@/components/misc/GoBackBtn";
import DfManageAccount from "./misc/DfManageAccount";

export default {
  components: {DfManageAccount, GoBackBtn},
  data() {
    return {
      vDf: false,
      obj: {},
      q: {order: 'updated_at:desc', page: 1, size: 15, name: '', email: ''},
      tableData: [],
      total: 0,
    };
  },
  mounted() {
    this.fetchPage();
  },
  created() {
  },
  methods: {
    doCreateAsset() {
      this.vDf = true
      this.obj = {}
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
          .get("/api/manage-account", {params: this.q})
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



    doUpdate(row) {
      this.vDf = true
      this.obj = row
    },
    doDelete(row) {
      this.$http.delete(`/api/manage-account/${row.id}`).then(res => {
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
