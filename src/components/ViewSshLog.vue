<template>
    <div>
        <el-row type="flex" justify="start" align="middle" class="toolbar">
            <el-button type="primary" size="mini" @click="$router.go(-1)">{{$t('back')}}</el-button>

        </el-row>
        <el-table :data="tableData" border style="width: 100%" stripe size="mini" cell-class-name="fortress-cell">
            <el-table-column fixed prop="id" label="id" :width="$store.state.idWidth"></el-table-column>
            <el-table-column :label="$t('ip')" prop="client_ip"></el-table-column>
            <el-table-column :label="$t('startedAt')" width="140">
                <template slot-scope="scope">
                    <span v-text="scope.row.started_at.substring(2,19)"></span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('createdAt')" width="140">
                <template slot-scope="scope">
                    <span v-text="scope.row.created_at.substring(2,19)"></span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('duration')" width="70">
                <template slot-scope="scope">
                    <span v-text="sessionDuration(scope.row)"></span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('logLength')">
                <template slot-scope="scope">
                    <span v-text="countLogLineCount(scope.row)"></span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('action')" width="120">
                <template slot-scope="scope">
                    <el-button-group>

                        <el-button
                                title="view detail information"
                                @click="doView(scope.row)"
                                type="primary"
                                size="mini"
                                v-text="$t('view')"
                        ></el-button>

                        <el-button
                                title="delete a row"
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


        <comp-term-log :obj="form" :visible.sync="termVisible" @afterClose="termVisible = false"></comp-term-log>
    </div>

</template>

<script>
    import CompTermLog from './CompTermLog'

    export default {
        components: {CompTermLog},
        name: 'ViewSshLog',
        data() {
            return {
                form: {log: ""},
                range: [],
                q: {client_ip: ''},
                termVisible: false,
                formTitle: "机器添加",
                total: 0,
                page: 1,
                size: 10,
                tableData: [],
            };
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            email() {
                return this.$store.getters.userEmail;
            },
            isAdmin() {
                return this.$store.getters.userIsAdmin;
            },
            user_id() {
                return parseInt(this.$route.query.user_id) || 0;
            },
            machine_id() {
                return parseInt(this.$route.query.machine_id) || 0;
            },
        },
        mounted() {
            this.fetchAllSshLog();
        },
        created() {
        },
        methods: {
            sessionDuration(row) {
                let d1 = Date.parse(row.created_at);
                let d2 = Date.parse(row.started_at);
                let delta = d1 - d2;
                return `${ Math.round(delta / 1000)}s`
            },
            countLogLineCount(row) {
                return row.log.split("\n").length
            },

            doCreate() {
                this.form = {id: 0, cate: 2, ssh_port: 22};
                this.formTitle = this.$t('machineAddTitle');
            },
            pageChange(val) {
                this.page = val;
                this.fetchAllSshLog()
            },

            sizeChange(val) {
                this.page = 1;
                this.size = val;
                this.fetchAllSshLog()
            },

            fetchAllSshLog() {
                let q = this.q;
                if (this.range.length === 2) {
                    q.from_time = this.range[0];
                    q.to_time = this.range[1]
                }
                q.page = this.page;
                q.size = this.size;
                q.user_id = this.user_id;
                q.machine_id = this.machine_id;
                this.$http
                    .get("/api/ssh-log", {params: q})
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
                this.$http.delete(`/api/ssh-log/${row.id}`).then(res => {
                    if (res) {
                        this.fetchAllSshLog();
                        this.$message.success(res.msg)
                    }
                })
            },
            doView(row) {
                this.form = row;
                this.termVisible = true
            },

        }
    };
</script>
<style scoped>


</style>
