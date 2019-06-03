<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" stripe>
            <el-table-column fixed prop="ID" label="ID" width="50"></el-table-column>
            <el-table-column prop="user_name" label="User" width="60">
            </el-table-column>
            <el-table-column prop="machine_name" label="Name" align="center">
            </el-table-column>
            <el-table-column prop="machine_host" label="Host" align="center">
            </el-table-column>
            <el-table-column prop="ip" label="IP" align="center">
            </el-table-column>

            <el-table-column label="level" width="80" align="center">
                <template slot-scope="scope">
                    <el-tag :type="levelType(scope.row)" :title="levelType(scope.row)"><i
                            class="el-icon-warning-outline"></i></el-tag>
                </template>
            </el-table-column>
            <el-table-column label="start" width="120">
                <template slot-scope="scope">
                    {{scope.row.start_time.substr(0,19)}}
                </template>
            </el-table-column>
            <el-table-column label="end" width="120">
                <template slot-scope="scope">
                    {{scope.row.end_time.substr(0,19)}}
                </template>
            </el-table-column>
            <el-table-column label="UpdatedAt" width="180">
                <template slot-scope="scope">
                    {{scope.row.UpdatedAt.substr(0,19)}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Action" width="80" align="center">
                <template slot-scope="scope">
                    <el-button
                            type="primary"
                            title="view ssh machine information"
                            @click="doView(scope.row)"
                            icon="el-icon-view"
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


        <!-- info -->
        <el-dialog title="SSH Xterm.js Input Logs" :visible.sync="dialogInfoVisible">
            <pre v-text="selectedLog" class="cat-view"></pre>
            <div slot="footer" class="dialog-footer">
                <el-button @click="doMark(4)" title="mark danger" icon="el-icon-error" type="danger"></el-button>
                <el-button @click="doMark(2)" title="mark warning" icon="el-icon-message-solid"
                           type="warning"></el-button>
                <el-button @click="doDelete" title="delete" icon="el-icon-delete-solid"></el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>

    export default {
        name: 'ViewTermLog',
        data() {
            return {
                selectedRow: {},
                selectedLog: "",
                dialogInfoVisible: false,
                total: 0,
                page: 1,
                size: 10,
                tableData: [],
                q: "",
            };
        },
        mounted() {
            this.fetchAllUser();
        },
        created() {
        },
        methods: {
            levelType(row) {
                switch (row.level) {
                    case 4:
                        return "danger";
                    case 2:
                        return "warning";
                    default:
                        return "info";
                }
            },

            pageChange(val) {
                this.page = val;
                this.fetchAllUser()
            },
            sizeChange(val) {
                this.page = 1;
                this.size = val;
                this.fetchAllUser()
            },

            fetchAllUser() {
                let page = this.page;
                let size = this.size;
                let where = '';
                this.$http
                    .get("api/term-log", {params: {where, page, size}})
                    .then(resp => {
                        if (resp) {
                            this.total = resp.total;
                            this.size = resp.size;
                            this.page = resp.page;
                            this.tableData = resp.data
                        }

                    })
            },
            doView(row) {
                this.selectedRow = row;
                this.selectedLog = row.log.replace(/\r/gi, "\r\n");
                //this.selectedLog = row.log
                this.dialogInfoVisible = true;
            },
            doMark(level) {
                let ID = this.selectedRow.ID;
                this.$http.patch(`api/term-log`, {ID, level}).then(res => {
                    if (res) {
                        this.fetchAllUser();
                        this.$message.success(res.msg);
                        this.dialogInfoVisible = false;

                    }
                });
                this.dialogInfoVisible = false;
            },
            doDelete() {
                this.$http.delete(`api/term-log/${this.selectedRow.ID}`).then(res => {
                    if (res) {
                        this.fetchAllUser();
                        this.$message.success(res.msg);
                        this.dialogInfoVisible = false;
                    }
                })
            }
        }
    };
</script>
<style scoped>


</style>
