<template>
    <div>

        <el-table :data="tableData"
                  border stripe>
            <el-table-column prop="id" label="ID" width="60"></el-table-column>

            <el-table-column prop="title_en" label="TitleEn">
            </el-table-column>
            <el-table-column prop="title_zh" label="TitleZh">
            </el-table-column>
            <el-table-column prop="cate" label="cate" width="80">
            </el-table-column>
            <el-table-column label="created_at" width="170">
                <template slot-scope="scope">
                    {{humanTime(scope.row.created_at)}}
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="Action" width="260" align="center">
                <template slot-scope="scope">

                    <el-button
                            title="view"
                            @click="doView(scope.row)"
                            type="success"
                            size="mini"
                            icon="el-icon-view"
                    ></el-button>
                    <el-button
                            title="edit"
                            @click="doEdit(scope.row)"
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"
                    ></el-button>

                    <el-button
                            title="delete"
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

        <df-hacknews :obj="form" :visible.sync="dfV" @afterClose="dfV = false" :type="dfType"></df-hacknews>


    </div>
</template>

<script>
    import DfHacknews from "./DfHacknews"
    export default {
        name: "ViewHacknews",
        components:{DfHacknews},
        data() {
            return {
                dfType:'view',
                form:{},
                dfV:false,
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
            doDelete(row) {
                this.$http.delete(`api/hacknews/${row.id}`).then(res => {
                    if (res) {
                        this.fetchList()
                    }
                })
            },
            doView(row) {
                this.dfV = true;
                this.dfType = "view";
                this.form = row
            },
            fetchList() {
                let page = this.page;
                let size = this.size;
                this.$http
                    .get("api/hacknews", {params: {page, size}})
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
            doEdit(row){
                this.dfV = true;
                this.dfType = "edit";
                this.form = row
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
