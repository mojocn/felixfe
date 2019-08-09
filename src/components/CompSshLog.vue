<template>
    <el-dialog :visible.sync="v"
               :title="termTitle"
               @opened="doOpened"
               @open="doOpen"
               @close="doClose"
               center
    >

        <div ref="terminal"></div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="v = false" v-t="{path:'cancel'}"></el-button>
            <el-radio-group v-model="status" @change="doChangeStatus">
                <el-radio-button :label="k" :key="k" v-for="(v,k) in marks">{{v}}</el-radio-button>
            </el-radio-group>
        </div>
    </el-dialog>
</template>

<script>
    import {Terminal} from "xterm";
    import "xterm/dist/xterm.css"

    export default {
        props: {obj: {type: Object, require: true}, visible: Boolean},
        name: "CompSshLog",
        data() {
            return {
                status: parseInt(this.obj.status),
                marks: {
                    2: '正常',
                    4: '警告',
                    8: '危险',
                    16: '致命',
                },
                searchKey: "",
                v: this.visible,
                term: null,
                thisV: this.visible
            };
        },
        watch: {
            visible(val) {
                this.v = val;//新增result的watch，监听变更并同步到myResult上
            }
        },
        computed: {
            logText() {
                return this.obj.log;
            },
            termTitle() {
                return `网页终端日志:${this.obj.started_at} - ${this.obj.created_at}`
            }
        },

        methods: {

            doLink(ev, url) {
                if (ev.type === 'click') {
                    window.open(url)
                }
            },
            doClose() {
                if (this.term) {
                    this.term.dispose()
                }
                this.$emit('afterClose')
            },
            doOpen() {
                this.status = parseInt(this.obj.status);
            },
            doChangeStatus() {
                let id = this.obj.id;
                let status = parseInt(this.status);
                this.$http.patch("term-log", {id, status}).then(res => {
                    if (res) {
                        this.$message.success("日志标记成功");
                        this.v = false;
                    }
                })

            },
            doOpened() {
                //Terminal.applyAddon(fit);
                //Terminal.applyAddon(webLinks);
                //Terminal.applyAddon(search);
                //TODO 网页终端添加搜索功能
                this.term = new Terminal({
                    disableStdin: true,
                    fontSize: 18,
                    cursorBlink: false,
                    cursorStyle: 'bar',
                    bellStyle: "sound",
                });
                this.term.open(this.$refs.terminal);
                this.term.write(this.logText);
                //this.term.fit(); // first resizing
                //this.term.webLinksInit(this.doLink);
                // term.on("resize", this.onTerminalResize);
            },
        },
    }
</script>

<style>


</style>