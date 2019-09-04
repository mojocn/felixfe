<template>
    <el-dialog :visible.sync="v"
               :title="termTitle"
               @opened="doOpened"
               @open="doOpen"
               @close="doClose"
               center
               :modal="false"
               :destroy-on-close="true"
               fullscreen
               custom-class="felix-dialog"
    >
        <div ref="terminal" class="felix-xterm"></div>
            </el-dialog>
</template>

<script>
    import {Terminal} from "xterm";
    import * as fit from "xterm/lib/addons/fit/fit";
    import * as webLinks from "xterm/lib/addons/webLinks/webLinks";
    import * as search from "xterm/lib/addons/search/search";
    import "xterm/dist/xterm.css"

    export default {
        props: {obj: {type: Object, require: true}, visible: Boolean},
        name: "CompTermLog",
        data() {
            return {
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

            },

            doOpened() {
                Terminal.applyAddon(fit);
                Terminal.applyAddon(webLinks);
                Terminal.applyAddon(search);
                //TODO 网页终端添加搜索功能
                this.term = new Terminal({
                    disableStdin: true,
                    fontSize: 18,
                    cursorBlink: false,
                    cursorStyle: 'bar',
                    bellStyle: "sound",
                });
                this.term.open(this.$refs.terminal);
                this.term.fit(); // first resizing
                this.term.webLinksInit(this.doLink);
                this.term.clear();
                let msg = this.obj.log;
                console.log(msg)
                // term.on("resize", this.onTerminalResize);
                this.term.write(this.obj.log)
            },


        },
    }
</script>

<style>


</style>