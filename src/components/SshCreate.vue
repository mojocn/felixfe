<style scoped>
.signin {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    text-align: center;
}

</style>
<template>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="date" label="日期" width="150">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="province" label="省份" width="120">
        </el-table-column>
        <el-table-column prop="city" label="市区" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="300">
        </el-table-column>
        <el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
                <el-button
                    @click="handleClickConsole(scope.row);"
                    type="text"
                    size="small"
                    >查看</el-button
                >
                <el-button type="text" size="small">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    data() {
        return {
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1518 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                }
            ],
            q: ""
        };
    },
    mounted() {
        this.fetchSshList(this.q);
    },
    created() {},
    methods: {
        fetchSshList(q) {
            let self = this
            this.$http
                .get("api/ssh", { params: { q } })
                .then(resp => {
                    self.$Message(resp);
                })
                .catch(error => {
                    self.$Message(error);
                });
        }
    }
};
</script>
