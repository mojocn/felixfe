<template>
    <div>

        <el-table :data="tableData"
                  :default-sort="{prop: 'created_at', order: 'descending'}"
                  border style="width: 100%" stripe>
            <el-table-column label="CreatedAt" width="170">
                <template slot-scope="scope">
                    {{humanTime(scope.row.CreatedAt)}}
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
            <el-table-column prop="slack_msg.icon_emoji" label="ICON" width="80">
            </el-table-column>
            <el-table-column prop="slack_msg.username" label="User" width="80">
            </el-table-column>
            <el-table-column label="detail">
                <template slot-scope="scope">
                    <h4 v-text="scope.row.slack_msg.attachments[0].fallback"></h4>
                    <p v-for="(ff,idx) in scope.row.slack_msg.attachments[0].fields" :key="idx">
                        <el-tag :type="scope.row.slack_msg.attachments[0].color" v-text="ff.title"></el-tag>
                        =>
                        <el-tag v-text="ff.value"></el-tag>
                    </p>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="Action" width="260" align="center">
                <template slot-scope="scope">

                    <el-button
                            title="view ssh machine information"
                            @click="doView(scope.row)"
                            type="success"
                            size="small"
                            icon="el-icon-view"
                    ></el-button>
                    <el-button
                            title="delete ssh connection"
                            @click="doDelete(scope.row)"
                            type="danger"
                            size="small"
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
                page: 1,
                size: 10,
                total: 0,
                tableData: [],
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
            doDelete(row) {
                this.$http.delete(`api/wslog/msg/${row.ID}`).then(res => {
                    if (res) {
                        this.fetchList()
                    }
                })
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
                            this.tableData = res.data
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
