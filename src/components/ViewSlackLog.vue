<template>
    <div>

        <el-table :data="msgs"
                  :default-sort="{prop: 'created_at', order: 'descending'}"
                  border style="width: 100%" stripe>
            <el-table-column label="CreatedAt" width="170">
                <template slot-scope="scope">
                    {{scope.row.created_at.substr(0,19)}}

                </template>
            </el-table-column>
            <el-table-column label="TYPE" width="170">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.attachments[0].color">{{scope.row.attachments[0].color}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="channel" label="channel" width="80">
            </el-table-column>
            <el-table-column prop="icon_emoji" label="ICON" width="80">
            </el-table-column>
            <el-table-column prop="username" label="User" width="80">
            </el-table-column>
            <el-table-column label="detail">
                <template slot-scope="scope">
                    <h4 v-text="scope.row.attachments[0].fallback"></h4>
                    <p v-for="(ff,idx) in scope.row.attachments[0].fields" :key="idx">
                        <el-tag :type="scope.row.attachments[0].color" v-text="ff.title"></el-tag>
                        =>
                        <el-tag v-text="ff.value"></el-tag>
                    </p>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="Action" width="260" align="center">
                <template slot-scope="scope">

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

                </template>
            </el-table-column>
        </el-table>


    </div>
</template>

<script>

    import config from "@/config/config"

    export default {
        name: "ViewSlackLog",
        data() {
            return {
                msgs: [],
            };
        },
        mounted() {
            let ws = new WebSocket(`${config.wsBase}/api/tlog-ws`);
            ws.onmessage = ev => {
                let obj = JSON.parse(ev.data);
                this.msgs.unshift(obj)
            };
            ws.onclose = (ce) => {
                if (ce.code !== 1005) {
                    this.$notify.error({
                        title: `code ${ce.code}`,
                        message: ce.reason,
                    });
                }
            };
            this.ws = ws
        },
        beforeDestroy() {
            this.ws.close()
        },
        created() {

        },
        methods: {}
    };
</script>
<style scoped>


</style>
