<template>
    <div>

        <el-table :data="msgs"
                  :default-sort="{prop: 'created_at', order: 'descending'}"
                  border style="width: 100%" stripe>
            <el-table-column label="CreatedAt" width="170">
                <template slot-scope="scope">
                    {{humanTime(scope.row.created_at)}}
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
                            @click="doView(scope.row)"
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

        <el-dialog
                title="Wslog Hook Log View As JSON"
                :visible.sync="logDialogV"
                width="50%"
                center>
            <pre v-text="logData" class="cat-view"></pre>
        </el-dialog>
    </div>
</template>

<script>

    import config from "@/config/config"

    export default {
        name: "ViewSlackLog",
        data() {
            return {
                logDialogV: false,
                logData: '',
                msgs: [],
            };
        },
        computed: {
            wsUrl() {
                let token = localStorage.getItem('token');
                return `${config.wsBase}/api/wslog/ws?&_t=${token}`
            }
        },
        mounted() {
            let ws = new WebSocket(this.wsUrl);
            ws.onmessage = ev => {
                let obj = JSON.parse(ev.data);
                this.msgs.unshift(obj)
            };
            ws.onclose = ce => {
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
        methods: {
            doDelete(row) {
                this.msgs = this.msgs.filter(ele => ele.id != row.id)
            },
            doView(row) {
                this.logDialogV = true;
                this.logData = JSON.stringify(row, null, 2)
            },
            humanTime(ss) {
                let thDate = new Date(ss);
                let curMts = Date.now();
                let thiMts = thDate.getTime();
                let diffts = (curMts - thiMts) / 1000;


                let Y = thDate.getFullYear(),
                    m = thDate.getMonth() + 1,
                    d = thDate.getDate();
                let H = thDate.getHours(),
                    i = thDate.getMinutes();

                if (diffts < 60) { // 一分钟以内
                    return `${Math.floor(diffts % 60)}s ago`;
                } else if (diffts < 3600) { // 一小时前之内
                    return `${Math.floor(diffts / 60)}m ago`;
                } else if (diffts < 3600 * 24) { // 一小时前之内
                    return `${Math.floor(diffts / 3600)}h ago`;
                } else {
                    return `${Y}-${m}-${d}T${H}:${i}`
                }
            },
        }
    };
</script>
<style scoped>


</style>
