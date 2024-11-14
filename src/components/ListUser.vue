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
      <el-table-column label="图片" width="80">
        <template slot-scope="scope">
          <el-image
              :src="scope.row.avatar"
              fit="scale-down"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="部门" prop="dept_path"></el-table-column>
      <el-table-column label="手机" prop="phone"></el-table-column>
      <el-table-column label="角色" prop="role"></el-table-column>
      <el-table-column label="上次活跃时间">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.updated_at)"></span>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" title="查看" type="primary" icon="el-icon-view" @click="doView(scope.row)"></el-button>
            <el-button size="mini" title="编辑" type="success" icon="el-icon-edit-outline"
                       @click="doUpdate(scope.row)"></el-button>
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

    <df-user-create :obj="{}" :visible="dfUserV" @afterClose="dfUserV=false;fetchPage()"></df-user-create>
  </div>

</template>

<script>
import GoBackBtn from "@/components/misc/GoBackBtn";

export default {
  name: 'ListUser',
  components: {GoBackBtn},
  data() {
    return {
      dfUserV: false,
      demo: [{id: 1, name: '云平台'}, {id: 2, name: '产品组'},],
      q: {order: 'updated_at:desc', page: 1, size: 15, name: '', email: ''},
      tableData: [],
      formLabelWidth: "120",
      dialogFormVisible: false,
      total: 0,
      form: {},
    };
  },
  mounted() {

    this.fetchPage();
  },
  created() {
  },
  methods: {
    openDfUserCreate() {
      this.dfUserV = true
    },
    doAudit() {
      this.$router.push({name: "requisitionAudit"})
    },
    doCreate() {
      this.$router.push({name: "requisitionCreate"})
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
      // this.$http
      //     .get("/api/user", {params: this.q})
      //     .then(resp => {
      //       if (resp) {
      //         let {page, size, list, total} = resp
      //         this.q.page = page
      //         this.q.size = size
      //         this.tableData = list
      //         this.total = total
      //       }
      //     })
    },
    doUpdate(row) {
      this.form = row;
      this.dialogFormVisible = true
    },

    doDelete(row) {
      this.$http.delete(`/api/user/${row.id}`).then(res => {
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
