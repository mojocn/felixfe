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
                                title="how to use Hook"
                                @click="doHelp(scope.row)"
                                type="success"
                                size="small"
                                icon="el-icon-help"
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
            <el-form :model="form" label-width="120px">
                <el-form-item label="Name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="Channel">
                    <el-select v-model="form.channel_id" placeholder="请选择">
                        <el-option
                                v-for="item in allChannel"
                                :key="item.ID"
                                :label="item.name"
                                :value="item.ID">
                        </el-option>
                    </el-select>
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

        <!--how to use hook-->
        <el-dialog
                title="使用说明"
                :visible.sync="hookDv"
                width="85%"
                center>
            <h3>Hook URL</h3>
            <h4 type="success">{{hookURL}}</h4>
            <pre v-text="hookCode"></pre>

            <span slot="footer" class="dialog-footer">
                <el-button @click="hookDv = false">Close</el-button>
                <el-button type="primary" @click="doCopyText(hookURL)">Copy hookURL</el-button>
                <el-button type="success" @click="doCopyText(hookCode)">Copy hookCode</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "ViewWslogHook",
        data() {
            return {
                allChannel: [],
                hookURL: "",
                hookCode: "",
                hookDv: false,
                page: 1,
                size: 10,
                total: 0,
                tableData: [],
                dialogFormVisible: false,
                form: {
                    channel_id: null,
                    name: "",
                    expire_at: null,
                },
            };
        },

        mounted() {
            this.fetchList();
            this.fetchAllChannels()
        },
        beforeDestroy() {
        },
        created() {

        },
        methods: {
            fetchAllChannels() {
                let page = 1;
                let size = 99999;
                this.$http
                    .get("api/wslog/channel", {params: {page, size}})
                    .then(res => {
                        if (res) {
                            this.allChannel = res.data
                        }
                    })
            },
            doHelp(row) {
                this.hookURL = `${window.location.protocol}//${window.location.host}/api/wslog/hook-api?_t=${row.token}`;
                this.hookCode = `
curl -X POST \\
  '${this.hookURL}' \\
  -H 'Content-Type: application/json' \\
  -H 'Postman-Token: 38928ade-cf38-4734-ae0d-a086894beb06' \\
  -H 'cache-control: no-cache' \\
  -d '{
    "text": "",
    "username": "felixAPP",
    "icon_url": "",
    "icon_emoji": ":shark:",
    "channel": "#felix",
    "unfurl_links": false,
    "attachments": [
      {
        "title": "",
        "fallback": "this mgs error c)EX)gNcGAJURrOAGo8i1)1XuT1k1dau+N",
        "text": "Message fields",
        "pretext": "this mgs error c)EX)gNcGAJURrOAGo8i1)1XuT1k1dau+N",
        "color": "danger",
        "fields": [
          {
            "title": "fBool",
            "value": "false",
            "short": true
          },
          {
            "title": "fFloat",
            "value": "0.45",
            "short": true
          },
          {
            "title": "time",
            "value": "2019-06-27 17:58:15.814461 +0800 CST m=+176.146665501",
            "short": false
          },
          {
            "title": "error",
            "value": "error fmt format: felix is awesome",
            "short": false
          },
          {
            "title": "fstring",
            "value": "awesome",
            "short": true
          },
          {
            "title": "fint",
            "value": "1",
            "short": true
          }
        ]
      }
    ]
  }'
                `;
                this.hookDv = true;
            },
            doCopyText(txt) {
                let el = document.createElement('textarea');
                // Set value (string to be copied)
                el.value = txt;
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
                this.form.id = 0;
                this.dialogFormVisible = true
            },
            doDelete(row) {
                this.$http.delete(`api/wslog/hook/${row.ID}`).then(res => {
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
                const url = 'api/wslog/hook';
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
                    .get("api/wslog/hook", {params: {page, size}})
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
