<template>
    <div>
        <el-row type="flex" justify="start" align="middle" class="toolbar">
            <el-col :span="4">
                <el-button icon="el-icon-s-cooperation" type="primary" @click="doCreate"
                           title="add a channel for wslog"></el-button>
            </el-col>
            <el-col :span="20"></el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" stripe>
            <el-table-column fixed prop="ID" label="ID" width="50">
            </el-table-column>
            <el-table-column prop="name" label="Name" width="80">
            </el-table-column>
            <el-table-column prop="purpose" label="Purpose">
            </el-table-column>
            <el-table-column prop="user_id" label="UserId">
            </el-table-column>
            <el-table-column prop="status" label="Status">
            </el-table-column>
            <el-table-column fixed="right" label="Action" width="160">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                                title="view ssh machine information"
                                @click="doUpdate(scope.row)"
                                type="success"
                                size="small"
                                icon="el-icon-edit"
                        ></el-button>
                        <el-button
                                title="delete ssh connection"
                                @click="doDelete(scope.row)"
                                type="danger"
                                size="small"
                                icon="el-icon-delete-solid"
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


        <!--edit-->
        <el-dialog title="WsLog Hook App" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="140px">
                <el-form-item label="Channel Name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="Channel Purpose">
                    <el-input v-model="form.purpose"></el-input>
                </el-form-item>
                <el-form-item label="Channel Purpose">
                    <el-radio v-model="form.status" :label="2">private</el-radio>
                    <el-radio v-model="form.status" :label="4">public</el-radio>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="doFormSubmit">Save</el-button>
                    <el-button @click="dialogFormVisible = false">Abort</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: "ViewWslogChannel",
        data() {
            return {
                allUsers: [],
                page: 1,
                size: 10,
                total: 0,
                tableData: [],
                dialogFormVisible: false,
                form: {
                    name: "",
                    purpose: "",
                    member_ids: [],

                    status: 2,
                },
            };
        },

        mounted() {
            this.fetchList()
        },
        beforeDestroy() {
        },
        created() {

        },
        methods: {

            doUpdate(row) {
                this.form = row;
                this.dialogFormVisible = true
            },
            doCreate() {
                this.form.Id = 0;
                this.dialogFormVisible = true
            },
            doDelete(row) {
                this.$http.delete(`api/wslog/channel/${row.ID}`).then(res => {
                    if (res) {
                        this.fetchList();
                        this.$message.success(res.msg)
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
            doFormSubmit() {
                let method = 'post';
                const url = 'api/wslog/channel';
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
                        this.fetchList()
                    }
                })
            },
            fetchList() {
                let page = this.page;
                let size = this.size;
                this.$http
                    .get("api/wslog/channel", {params: {page, size}})
                    .then(res => {
                        if (res) {
                            this.total = res.total;
                            this.size = res.size;
                            this.page = res.page;
                            this.tableData = res.data
                        }
                    })
            }
        }
    };
</script>
<style scoped>


</style>
