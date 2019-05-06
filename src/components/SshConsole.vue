<style scoped>

</style>

<template>
    <div id="terminal"></div>
</template>
<script>
import { Terminal } from "xterm";
// import FileTree from "./filetree/FileTree";
import terminalResize from "@/libs/terminal-resize";
import sshWebSocket from "@/libs/sshwebsocket";
import theme from "@/config/terminal_theme";

// import 'xterm/dist/xterm.css';  //xterm.css D:\workspace\javascript\frontend\sshwebconsole\node_modules\
import * as fit from "xterm/lib/addons/fit/fit";
import * as fullscreen from "xterm/lib/addons/fullscreen/fullscreen";
import "xterm/lib/addons/fullscreen/fullscreen.css";
import "xterm/dist/xterm.css"
/* And for typescript, see: https://webpack.js.org/guides/typescript/ */
import config from "@/config/config"
let term = null;

export default {
  // components: {
    //   FileTree
    // },
  data() {
    return {
      connectionAlive: false,
      host: "waiting connection",
      username: "Loading",
      statusIsFullscreen: false,
      fileTransferModal: false,
        ws:null
    };
  },
  computed: {

  },
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
    // let self = this
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

    const socket = new WebSocket(`${config.wsBase}/ws/ssh/${this.$route.query.id || 0}?cols=${term.cols}&rows=${term.rows}`)
    this.connectionAlive = true;
    this.ws = socket
    socket.onclose = () => {
      term.setOption("cursorBlink", false);
      this.connectionAlive = false;
      this.this.$message("console.web_socket_disconnect")
    };
    sshWebSocket.bindTerminal(term, socket, true, -1);
    terminalResize.bindTerminalResize(term, socket);
  },
  beforeDestroy() {

    window.removeEventListener("resize", this.onWindowResize);
    // term.off("resize", this.onTerminalResize);
      if (this.ws){
          this.ws.close()
      }
  }
};
</script>
