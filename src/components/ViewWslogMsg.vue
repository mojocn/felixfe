<template>
    <div>
        <el-row type="flex" justify="start" align="middle" class="toolbar">
            <el-button type="primary" size="small" @click="$router.go(-1)">{{$t('back')}}</el-button>
            <el-button type="danger" size="small" v-if="selectedRows && selectedRows.length >0" @click="doDeleteAll">
                {{$t('rmSelected')}}
            </el-button>
            <div class="search-bar">

                <el-input v-model.trim="q.path"
                          class="table-search-input"
                          @change="fetchList"
                          prefix-icon="el-icon-search"
                          size="small"
                          :placeholder="$t('sftpLogPathPhS')"
                          clearable>
                </el-input>

               

                <el-button type="primary" size="small"
                           icon="el-icon-search"
                           @click="fetchList"
                           :title="$t('btnSearch')">
                </el-button>
            </div>
        </el-row>

        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  border style="width: 100%" stripe>
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="created_at" width="170">
                <template slot-scope="scope">
                    {{humanTime(scope.row.created_at)}}
                </template>
            </el-table-column>
            <el-table-column label="TYPE" width="170">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.slack_msg.attachments[0].color">
                        {{scope.row.slack_msg.attachments[0].color}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="slack_msg.channel" label="channel" width="80">
            </el-table-column>
            <el-table-column label="detail" width="300">
                <template slot-scope="scope">
                    <h4 v-text="scope.row.slack_msg.attachments[0].fallback"></h4>
                    <p v-for="(ff,idx) in scope.row.slack_msg.attachments[0].fields" :key="idx">
                        <el-tag :type="scope.row.slack_msg.attachments[0].color" v-text="ff.title"></el-tag>
                        =>
                        <el-tag v-text="ff.value"></el-tag>
                    </p>
                </template>
            </el-table-column>

            <el-table-column label="Action" width="260" align="center">
                <template slot-scope="scope">
                    <el-button
                            title="view ssh machine information"
                            @click="doView(scope.row)"
                            type="success"
                            size="mini"
                            icon="el-icon-view"
                    ></el-button>
                    <el-button
                            title="delete ssh connection"
                            @click="doDelete(scope.row)"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete-solid"
                    ></el-button>

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
        <el-dialog
                title="Wslog Hook Log View As JSON"
                :visible.sync="logDialogV"
                width="50%"
                center>
            <pre v-text="logData" class="cat-view"></pre>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: "ViewWslogMsg",
        data() {
            return {
                q:{},
                selectedRows:[],
                tableData:[],
                page: 1,
                size: 10,
                total: 0,
                logDialogV: false,
                logData: '',
            };
        },

        mounted() {
            this.fetchList()
        },
        created() {

        },
        methods: {
            handleSelectionChange(val) {
                this.selectedRows = val;
            },
            doDeleteAll() {
                if (!this.selectedRows || this.selectedRows.length === 0) {
                    return;
                }
                const ids = [];
                this.selectedRows.forEach(vv => {
                    ids.push(vv.id)
                });
                this.privateRm(ids)
            },
            privateRm(ids) {
                if (!ids || !Array.isArray(ids)) {
                    return
                }
                this.$confirm(this.$t("confirmDeleteMsg"), this.$t("confirmDeleteTitle"), {
                    confirmButtonText: this.$t("ok"),
                    cancelButtonText: this.$t("cancel"),
                    type: 'warning'
                }).then(() => {
                    this.$http.post(`api/wslog/msg-rm`, ids).then(res => {
                        if (res) {
                            this.fetchList();
                            this.$message.success(res.msg)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t("confirmDeleteCancel")
                    });
                });
            },
            doDelete(row) {
                this.privateRm([row.id])
            },
            doView(row) {
                this.logDialogV = true;
                this.logData = JSON.stringify(row, null, 2)
            },
            fetchList() {
                let page = this.page;
                let size = this.size;
                this.$http
                    .get("api/wslog/msg", {params: {page, size}})
                    .then(res => {
                        if (res) {
                            this.total = res.total;
                            this.size = res.size;
                            this.page = res.page;
                            this.tableData = res.data;
                        }
                    })
            },
            pageChange(val) {
                this.page = val;
                this.fetchList()
            },
            sizeChange(val) {
                this.page = 1;
                this.size = val;
                this.fetchList()
            },
            humanTime: function (timeS) {
                let date = new Date(timeS);
                let delta = Math.round((+new Date - date) / 1000);
                let minute = 60;
                let hour = minute * 60;
                let day = hour * 24;
                let week = day * 7;
                let mm = day * 31;
                let fuzzy;
                if (delta < 30) {
                    fuzzy = '现在';
                } else if (delta < minute) {
                    fuzzy = delta + ' 秒前';
                } else if (delta < 2 * minute) {
                    fuzzy = '一分钟前'
                } else if (delta < hour) {
                    fuzzy = Math.floor(delta / minute) + ' 分钟前';
                } else if (Math.floor(delta / hour) == 1) {
                    fuzzy = '一小时前'
                } else if (delta < day) {
                    fuzzy = Math.floor(delta / hour) + ' 小时前';
                } else if (delta < day * 2) {
                    fuzzy = '昨天';
                } else if (delta < week) {
                    fuzzy = Math.floor(delta / day) + ' 天前';
                } else if (delta < mm) {
                    fuzzy = Math.floor(delta / week) + ' 周前';
                } else {
                    fuzzy = date.toISOString().slice(2, 10).replace('T', ' ')

                }
                return fuzzy
            }
        }
    };
</script>
<style scoped>


</style>
