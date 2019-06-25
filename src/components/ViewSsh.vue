<style scoped>


</style>
<template>
    <div>
        <el-row class="toolbar" type="flex">
            <el-col :span="4">
                <el-button icon="el-icon-s-promotion" type="primary" @click="doCreate"></el-button>
            </el-col>
            <el-col :span="20"></el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" stripe>
            <el-table-column fixed prop="ID" label="ID" width="50">
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column prop="ip" label="IP">
            </el-table-column>
            <el-table-column prop="port" label="Port" width="60">
            </el-table-column>
            <el-table-column prop="user" label="User" width="120">
            </el-table-column>
            <el-table-column prop="type" label="Type" width="120">
            </el-table-column>
            <el-table-column label="UpdatedAt" width="170">
                <template slot-scope="scope">
                    {{scope.row.UpdatedAt.substr(0,19)}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Action" width="260" align="center">
                <template slot-scope="scope">
                        <el-button
                                title="open terminal"
                                @click="handleClickConsole(scope.row)"
                                type="primary"
                                size="small"
                                icon="el-icon-video-play"
                        ></el-button>
                        <el-button
                                title="edit ssh connection configuration"
                                @click="handleClickUpdate(scope.row)"
                                type="warning"
                                size="small"
                                icon="el-icon-edit"
                        ></el-button>
                        <el-button
                                title="view ssh machine information"
                                @click="handleClickView(scope.row)"
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
                        <el-button
                                title="open a sftp app"
                                @click="handleClickSftp(scope.row)"
                                size="small"
                                icon="el-icon-sort"
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

        <!--edit-->
        <el-dialog title="ssh" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="ssh name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="ssh host" :label-width="formLabelWidth">
                    <el-input v-model="form.host" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="ssh user" :label-width="formLabelWidth">
                    <el-input v-model="form.user" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="ssh password" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="ssh port" :label-width="formLabelWidth">
                    <el-input v-model="form.port" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="auth type" :label-width="formLabelWidth">
                    <el-select v-model="form.type" placeholder="请选择活动区域">
                        <el-option label="password" value="password"></el-option>
                        <el-option label="private key" value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleFormSubmit">Submit</el-button>
            </div>
        </el-dialog>
        <!-- info -->
        <el-dialog title="SSH Machine Hardware Infomartion" :visible.sync="dialogInfoVisible" width="80%">
            <pre v-text="JSON.stringify(info, null, 2)"></pre>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInfoVisible = false">Close</el-button>
            </div>
        </el-dialog>

        <comp-term :obj="selectedRow" :visible="termVisible" @pclose="doClose"></comp-term>


    </div>

</template>

<script>
    import CompTerm from "./CompTerm";

    export default {
        components: {CompTerm},
        name: "ViewSsh",
        props: ['ID', 'name', 'user'],
        data() {
            return {
                termVisible: false,
                selectedRow: {},
                dialogInfoVisible: false,
                formLabelWidth: '120px',
                dialogFormVisible: false,
                total: 0,
                page: 1,
                size: 10,
                tableData: [],
                q: "",
                form: {},
                info: {}
            };
        },
        mounted() {
            this.fetchAllUser();
        },
        created() {
        },
        methods: {
            doClose(flag) {
                this.termVisible = flag
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
                    .get("api/ssh", {params: {where, page, size}})
                    .then(resp => {
                        if (resp) {
                            this.total = resp.total;
                            this.size = resp.size;
                            this.page = resp.page;
                            this.tableData = resp.data
                        }

                    })
            },
            handleClickConsole(row) {
                this.selectedRow = row;
                this.termVisible = true;
                // this.$router.push({'name': 'sshConsole', params: row})
            },

            handleClickSftp(row) {
                this.$router.push({'name': 'sftp', params: row})
            },
            handleClickUpdate(row) {
                this.form = row;
                this.dialogFormVisible = true
            },
            handleFormSubmit() {
                let method = 'post';
                let url = 'api/ssh';
                if (this.form.ID > 0) {
                    method = "patch";
                } else {
                    method = "post"
                }
                let data = this.form;
                this.$http({method, url, data}).then(res => {
                    if (res) {
                        this.$message.success("success");
                        this.dialogFormVisible = false;
                        this.fetchAllUser()
                    }
                })
            },
            handleClickView(row) {
                this.info = row;
                this.$http.get(`api/ssh/${row.ID}`).then(res => {
                    if (res) {
                        this.info = res.data;

                    }
                    this.dialogInfoVisible = true;
                })
            },
            doCreate() {
                this.form = {user: '', port: 22, password: '', name: '', ID: 0, type: "password"};
                this.dialogFormVisible = true
            },
            doDelete(row) {
                this.$http.delete(`api/ssh/${row.ID}`).then(res => {
                    if (res) {
                        this.fetchAllUser();
                        this.$message.success(res.msg)
                    }
                })
            }
        }
    };
</script>
