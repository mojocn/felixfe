<template>
    <el-dialog :visible.sync="v"
               :title="obj.user + '@' + obj.host"
               @opened="doOpened"
               @open="doOpen"
               @close="doClose"
               center
               fullscreen
               custom-class="felix-dialog"
    >

        <div ref="terminal" class="felix-xterm"></div>

    </el-dialog>
</template>

<script>
    import {Terminal} from "xterm";
    import * as fit from "xterm/lib/addons/fit/fit";
    import * as terminado from "../libs/terminado/terminado"
    import * as webLinks from "xterm/lib/addons/webLinks/webLinks";
    import * as search from "xterm/lib/addons/search/search";
    import "xterm/dist/xterm.css"
    import config from "@/config/config"

    export default {
        props: {obj: {type: Object, require: true}, visible: Boolean},
        name: "CompTlog",
        data() {
            return {
                isFullScreen: false,
                searchKey: "",
                v: this.visible,
                ws: null,
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
            wsUrl() {
                return `${config.wsBase}/api/tlog-ws`
            }
        },

        methods: {
            onWindowResize() {
                //console.log("resize")
                this.term.fit(); // it will make terminal resized.
            },
            doLink(ev, url) {
                if (ev.type === 'click') {
                    window.open(url)
                }
            },
            doClose() {
                terminado.terminadoDetach(this.term, this.ws);
                if (this.ws) {
                    this.ws.close()
                }
                if (this.term) {
                    this.term.dispose()
                }
                this.$emit('ptclose', false)//子组件对openStatus修改后向父组件发送事件通知
            },
            doOpen() {

            },
            doOpened() {
                Terminal.applyAddon(fit);
                Terminal.applyAddon(webLinks);
                Terminal.applyAddon(search);
                Terminal.applyAddon(terminado);
                this.term = new Terminal({
                    fontSize: 21,
                    cursorBlink: true,
                    cursorStyle: 'bar',
                    bellStyle: "sound",
                });
                this.term.open(this.$refs.terminal);
                this.term.fit(); // first resizing
                this.term.webLinksInit(this.doLink);
                this.ws = new WebSocket(this.wsUrl);
                terminado.terminadoAttach(this.term, this.ws, true, true);

                this.ws.onclose = (ce) => {
                    //console.log(ce)
                    this.term.setOption("cursorBlink", false);
                    if (ce.code !== 1005) {
                        this.$notify.error({
                            title: `code ${ce.code}`,
                            message: ce.reason,
                        });
                        this.doClose();
                    }
                };

            },

        },


    }
</script>

<style>
    .felix-xterm {
        height: calc(100vh - 60px) !important;
    }

    .felix-dialog {
        background-color: #1b212f !important;
        margin: 0 !important;
    }

    .felix-dialog .el-dialog__body {
        /*border: white solid 1px!important;*/
        padding: 0 !important;

    }

    .felix-dialog .el-dialog__title {
        color: white;
        font-weight: bold;
    }

    .felix-dialog .el-dialog__headerbtn {
        font-size: 2rem !important;
        color: white;
        font-weight: bold !important;
    }
</style>