<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-button icon="el-icon-s-promotion" type="primary" @click="doCreate"></el-button>
            </el-col>
            <el-col :span="20"></el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" stripe>
            <el-table-column fixed prop="ID" label="ID" width="50">
            </el-table-column>
            <el-table-column label="Avatar" width="80">
                <template slot-scope="scope">
                    <img v-bind:src="scope.row.avatar" width="40px"/>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="name">
            </el-table-column>
            <el-table-column prop="email" label="email">
            </el-table-column>
            <el-table-column prop="mobile" label="Mobile" width="180">
            </el-table-column>

            <el-table-column label="CreatedAt" width="180">
                <template slot-scope="scope">
                    {{scope.row.CreatedAt.substr(0,19)}}
                </template>
            </el-table-column>
            <el-table-column label="UpdatedAt" width="180">
                <template slot-scope="scope">
                    {{scope.row.UpdatedAt.substr(0,19)}}
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="Action" width="240">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                                title="view ssh machine information"
                                @click="doUpdate(scope.row)"
                                :disabled="scope.row.ID == 1"
                                type="success"
                                size="small"
                                icon="el-icon-edit"
                        ></el-button>
                        <el-button
                                title="delete ssh connection"
                                @click="doDelete(scope.row)"
                                :disabled="scope.row.ID == 1"
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
        <el-dialog title="ssh" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="UserName" label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="password" label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="email" label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="mobile" label-width="formLabelWidth">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="avatar" label-width="formLabelWidth">
                    <el-input v-model="form.avatar" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Role" label-width="formLabelWidth">
                    <el-select v-model="form.role_id" placeholder="role">
                        <el-option label="SuperAdmin" :value="2"></el-option>
                        <el-option label="OPS" :value="4"></el-option>
                        <el-option label="Dev" :value="8"></el-option>
                        <el-option label="Test" :value="16"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleFormSubmit">Submit</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>

    export default {
        name: 'ViewUser',
        data() {
            return {
                formLabelWidth: "120",
                dialogFormVisible: false,
                total: 0,
                page: 1,
                size: 10,
                tableData: [],
                form: {},
                q: "",
            };
        },
        mounted() {
            this.fetchAllUser();
        },
        created() {
        },
        methods: {
            doCreate() {
                this.dialogFormVisible = true
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
                    .get("api/user", {params: {where, page, size}})
                    .then(resp => {
                        if (resp) {
                            this.total = resp.total;
                            this.size = resp.size;
                            this.page = resp.page;
                            this.tableData = resp.data
                        }

                    })
            },
            doUpdate(row) {
                this.form = row;
                this.dialogFormVisible = true
            },
            handleFormSubmit() {
                let method = 'post';
                let url = '';
                if (this.form.ID > 0) {
                    method = "patch";
                    url = `api/user/${this.form.ID}`
                } else {
                    url = 'api/user';
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
            doDelete(row) {
                this.$http.delete(`api/user/${row.ID}`).then(res => {
                    if (res) {
                        this.fetchAllUser();
                        this.$message.success(res.msg)
                    }
                })
            }
        }
    };
</script>
<style scoped>


</style>
