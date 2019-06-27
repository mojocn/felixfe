<template>
    <div>
        <el-row type="flex" justify="start" align="middle" class="toolbar">
            <el-col :span="4">
                <el-button icon="el-icon-s-cooperation" type="primary" @click="doCreate"
                           title="add a user"></el-button>
            </el-col>
            <el-col :span="20"></el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" stripe>
            <el-table-column fixed prop="ID" label="ID" width="50">
            </el-table-column>
            <el-table-column prop="name" label="Name" width="80">
            </el-table-column>
            <el-table-column prop="token" label="Token">
            </el-table-column>
            <el-table-column prop="expire_at" label="ExpireAt" width="179">
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
                        <el-button
                                title="copy Hook URL"
                                @click="doCopyURL(scope.row)"
                                type="success"
                                size="small"
                                icon="el-icon-document-copy"
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
            <el-form :model="form">
                <el-form-item label="App Name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="Hook Expire At">
                    <el-date-picker
                            v-model="form.expire_at"
                            type="datetime"
                            placeholder="please select a time">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="doFormSubmit">Create</el-button>
                    <el-button @click="dialogFormVisible = false">Abort</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ViewWslogGroup",
        data() {
            return {
                page: 1,
                size: 10,
                total: 0,
                tableData: [],
                dialogFormVisible: false,
                form: {
                    name: "",
                    expire_at: null,
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

            doCopyURL(row) {
                var el = document.createElement('textarea');
                // Set value (string to be copied)
                el.value = `http://${window.location.host}/api/wslog/hook?_t=${row.token}`;
                // Set non-editable to avoid focus and move outside of view
                el.setAttribute('readonly', '');
                el.style = {position: 'absolute', left: '-9999px'};
                document.body.appendChild(el);
                // Select text inside element
                el.select();
                // Copy text to clipboard
                document.execCommand('copy');
                // Remove temporary element
                document.body.removeChild(el);
                this.$message.info("hook URL has copy into clipboard")
            },
            doUpdate(row) {
                this.form = row;
                this.dialogFormVisible = true
            },
            doCreate() {
                this.form.Id = 0;
                this.dialogFormVisible = true
            },
            doDelete(row) {
                this.$http.delete(`api/wslog/group/${row.ID}`).then(res => {
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
                const url = 'api/wslog/group';
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
                    .get("api/wslog/group", {params: {page, size}})
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
