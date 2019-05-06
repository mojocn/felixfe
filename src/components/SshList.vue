<style scoped>


</style>
<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" stripe height="500px">
            <el-table-column fixed prop="ID" label="ID" width="50">
            </el-table-column>
            <el-table-column prop="name" label="Name" >
            </el-table-column>
            <el-table-column prop="port" label="Port" width="60">
            </el-table-column>
            <el-table-column prop="user" label="User">
            </el-table-column>
            <el-table-column prop="type" label="Type">
            </el-table-column>
            <el-table-column label="UpdatedAt" width="180">
                <template slot-scope="scope">
                    {{scope.row.UpdatedAt.substr(0,19)}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Action" width="200" >
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                                @click="handleClickConsole(scope.row);"
                                type="primary"
                                size="small"
                                icon="el-icon-video-play"
                        ></el-button>
                        <el-button
                                @click="handleClickUpdate(scope.row);"
                                type="warning"
                                size="small"
                                icon="el-icon-edit"
                        ></el-button>
                        <el-button
                                @click="handleClickView(scope.row);"
                                type="success"
                                size="small"
                                icon="el-icon-monitor"
                        ></el-button>
                        <el-button
                                @click="handleClickDelete(scope.row);"
                                type="danger"
                                size="small"
                                icon="el-icon-delete-solid"
                        ></el-button>
                    </el-button-group>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="sizeChange"
                @current-change="pageChange"
                :current-page="page"
                :page-sizes="[15, 30, 45, 60]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>

</template>

<script>
export default {
    data() {
        return {
            total:0,
            page:1,
            size:15,
            tableData: [],
            q: ""
        };
    },
    mounted() {
        this.fetchSshList();
    },
    created() {},
    methods: {
        pageChange(val){
            this.page =val
            this.fetchSshList()
        },
        sizeChange(val){
            this.page = 1
            this.size =val
            this.fetchSshList()
        },
        fetchSshList() {
            let page = this.page
            let size = this.size
            let where = ''
            this.$http
                .get("api/ssh", {params: {where,page,size}})
                .then(resp => {
                    this.total = resp.total
                    this.size = resp.size
                    this.page = resp.page
                    this.tableData = resp.data
                })
        },
        handleClickConsole(row) {
            this.$router.push({'name': 'sshConsole', query: {id: row.ID}})
        },
        handleClickDelete(row) {
            this.$http.delete(`api/ssh/${row.ID}`).then(res => {
                if (res.ok){
                    this.$message.success(res.msg)
                    this.fetchSshList()
                }else {
                    this.$message.error(res.msg)
                }
            })
        }
    }
};
</script>
