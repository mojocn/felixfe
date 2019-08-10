<template>
    <div>
        <el-row type="flex" justify="start" align="middle" class="toolbar">
            <el-button type="primary" size="small" @click="$router.go(-1)">{{$t('back')}}</el-button>
            <div class="search-bar">
                <el-input v-model.trim="q.page_url"
                          @blur="fetchComment"
                          class="table-search-input"
                          prefix-icon="el-icon-search"
                          size="small"
                          :placeholder="$t('pageUrlPhs')"
                          clearable>
                </el-input>

                <el-button type="primary" size="small"
                           icon="el-icon-search"
                           @click="fetchComment"
                           :title="$t('btnSearch')">
                </el-button>
            </div>

        </el-row>
        <el-table :data="tableData" border style="width: 100%" stripe size="mini" cell-class-name="fortress-cell">
            <el-table-column fixed prop="id" label="ID" :width="$store.state.idWidth">
            </el-table-column>
            <el-table-column :label="$t('pageUrl')" prop="page_url"></el-table-column>
            <el-table-column :label="$t('content')" prop="content"></el-table-column>
            <el-table-column :label="$t('updatedAt')" width="140">
                <template slot-scope="scope">
                    <span v-text="scope.row.updated_at.substring(2,19)"></span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('action')" width="190">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                                title="view detail"
                                @click="openDialogForm(scope.row,'view')"
                                type="warning"
                                size="mini"
                                v-text="$t('view')"
                        ></el-button>

                        <el-button
                                :title="$t('btnDelete')"
                                @click="doDelete(scope.row)"
                                type="danger"
                                size="mini"
                                v-text="$t('delete')"
                        ></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="margin-top: 20px"
                @size-change="sizeChange"
                @current-change="pageChange"
                :current-page="page"
                :page-sizes="[10,15, 30, 45, 60]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>

    </div>
</template>

<script>
    export default {
        name: 'ViewComment',
        data() {
            return {
                q: {remark: "", page_url: ""},
                total: 0,
                page: 1,
                size: 10,
                tableData: [],
                form: {},
            };
        },
        mounted() {
            this.fetchComment();
        },
        methods: {
            pageChange(val) {
                this.page = val;
                this.fetchComment()
            },
            sizeChange(val) {
                this.page = 1;
                this.size = val;
                this.fetchComment()
            },
            fetchComment() {
                let q = this.q;
                q.page = this.page;
                q.size = this.size;
                this.$http
                    .get("/api/comment", {params: q})
                    .then(resp => {
                        if (resp) {
                            this.total = resp.total;
                            this.size = resp.size;
                            this.page = resp.page;
                            this.tableData = resp.data
                        }
                    })
            },
            doDelete(row) {
                this.$http.delete(`/api/comment/${row.id}`).then(res => {
                    if (res) {
                        this.fetchComment();
                        this.$message.success(res.msg)
                    }
                })
            },
        }
    };
</script>
<style scoped>


</style>
