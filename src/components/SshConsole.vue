<style scoped>

    #terminal {
        height: 100%;
    }
</style>

<template>
    <section>
        <el-row justify="center" type="flex" :gutter="80">
            <el-col :span="6">
                <el-button icon="el-icon-back" @click="$router.go(-1)" type="primary"></el-button>
            </el-col>
            <el-col :span="18"><h2> SshXterm: {{user}} @ {{name}}</h2></el-col>
        </el-row>
        <div id="terminal"></div>
    </section>
</template>
<script>
    import {Terminal} from "xterm";
    import terminalResize from "@/libs/terminal-resize";
    import sshWebSocket from "@/libs/sshwebsocket";
    import theme from "@/config/terminal_theme";
    import * as fit from "xterm/lib/addons/fit/fit";
    import * as fullscreen from "xterm/lib/addons/fullscreen/fullscreen";
    import "xterm/lib/addons/fullscreen/fullscreen.css";
    import "xterm/dist/xterm.css"
    import config from "@/config/config"

    let term = null;

    export default {
        props: ['ID', 'name', 'user'],
        data() {
            return {
                connectionAlive: false,
                host: "waiting connection",
                username: "Loading",
                statusIsFullscreen: false,
                fileTransferModal: false,
                ws: null
            };
        },
        computed: {},
        methods: {


            onWindowResize() {
                //console.log('size change')
                // this function will be called when resizing window or entering/exiting full screen mode.
                term.fit(); // it will make terminal resized.
            }
            // onTerminalResize(size) {
            //   this.termConfig.rows = size.rows;
            //   this.termConfig.cols = size.cols;
            // }
        },
        created() {

        },
        mounted() {
            Terminal.applyAddon(fullscreen);
            Terminal.applyAddon(fit);
            term = new Terminal({
                cursorBlink: true,
                bellStyle: "sound",
                theme: theme.default_theme
            });
            term.open(document.getElementById("terminal"));

            // term.on("resize", this.onTerminalResize);
            window.addEventListener("resize", this.onWindowResize);
            term.fit(); // first resizing
            let token = localStorage.getItem('token')
            const socket = new WebSocket(`${config.wsBase}/api/ws/${this.ID || 0}?cols=${term.cols}&rows=${term.rows}&_t=${token}`);
            socket.onerror = () => {
                this.$message.error('ws has no token, please login first')
                this.$router.push({name: 'login'})
                return
            }

            this.connectionAlive = true;
            this.ws = socket
            socket.onclose = () => {
                term.setOption("cursorBlink", false);
                this.connectionAlive = false;
                this.$message("console.web_socket_disconnect")
            };
            sshWebSocket.bindTerminal(term, socket, true, -1);
            terminalResize.bindTerminalResize(term, socket);
        },
        beforeDestroy() {

            window.removeEventListener("resize", this.onWindowResize);
            // term.off("resize", this.onTerminalResize);
            if (this.ws) {
                this.ws.close()
            }
        }
    };
</script>
