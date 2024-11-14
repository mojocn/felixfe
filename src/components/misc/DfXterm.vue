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
import {Base64} from "js-base64";
import * as webLinks from "xterm/lib/addons/webLinks/webLinks";
import * as search from "xterm/lib/addons/search/search";
import "xterm/dist/xterm.css"
import config from "@/libs/config"

let bindTerminalResize = (term, websocket) => {
  let onTermResize = size => {
    websocket.send(
        JSON.stringify({
          type: "resize",
          rows: size.rows,
          cols: size.cols,
        })
    );
  };
  // register resize event.
  term.on("resize", onTermResize);
  // unregister resize event when WebSocket closed.
  websocket.addEventListener("close", function () {
    term.off("resize", onTermResize);
  });
};
let bindTerminal = (term, websocket, bidirectional, bufferedTime) => {
  term.write('\r\nWelcome to Felix Web Ssh Terminal\n\r\n');
  term.socket = websocket;
  let messageBuffer = null;
  let handleWebSocketMessage = function (ev) {
    if (bufferedTime && bufferedTime > 0) {
      if (messageBuffer) {
        messageBuffer += ev.data;
      } else {
        messageBuffer = ev.data;
        setTimeout(function () {
          term.write(messageBuffer);
        }, bufferedTime);
      }
    } else {
      term.write(ev.data);
    }
  };

  let handleTerminalData = function (data) {
    websocket.send(
        JSON.stringify({
          type: "cmd",
          cmd: Base64.encode(data) // encode data as base64 format
        })
    );
  };

  websocket.onmessage = handleWebSocketMessage;
  if (bidirectional) {
    term.on("data", handleTerminalData);
  }

  // send heartbeat package to avoid closing webSocket connection in some proxy environmental such as nginx.
  let heartBeatTimer = setInterval(function () {
    websocket.send(JSON.stringify({type: "heartbeat", data: ""}));
  }, 20 * 1000);

  websocket.addEventListener("close", function () {
    websocket.removeEventListener("message", handleWebSocketMessage);
    term.off("data", handleTerminalData);
    delete term.socket;
    clearInterval(heartBeatTimer);
  });
};
export default {
  props: {obj: {type: Object, require: true}, visible: Boolean},
  name: "DfXterm",
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
    termTitle() {
      if (this.obj && this.obj.cluster_ssh) {
        return `${this.obj.cluster_ssh.ssh_user || ''}@${this.obj.ssh_ip}:${this.obj.ssh_port}`
      }
      return ""
    },
    wsUrl() {
      let token = localStorage.getItem('token');
      return `${config.wsBase}/ws/ssh/${this.obj.id || 0}?cols=${this.term.cols}&rows=${this.term.rows}&_t=${token}`
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
      window.removeEventListener("resize", this.onWindowResize);
      // term.off("resize", this.onTerminalResize);
      if (this.ws) {
        this.ws.close()
      }
      if (this.term) {
        this.term.dispose()
      }
      this.$emit('afterClose')//子组件对openStatus修改后向父组件发送事件通知
    },
    doOpen() {

    },
    doOpened() {
      Terminal.applyAddon(fit);
      Terminal.applyAddon(webLinks);
      Terminal.applyAddon(search);
      //TODO 网页终端添加搜索功能
      this.term = new Terminal({
        //rows: 20,
        fontSize: 18,
        cursorBlink: true,
        cursorStyle: 'bar',
        bellStyle: "sound",
      });
      this.term.open(this.$refs.terminal);
      this.term.fit(); // first resizing
      this.term.webLinksInit(this.doLink);
      // term.on("resize", this.onTerminalResize);
      window.addEventListener("resize", this.onWindowResize);
      this.ws = new WebSocket(this.wsUrl);
      // this.ws.onerror = event => {
      //     console.log(event)
      //     this.$message.error('ssh ws failed please retry or check your auth config');
      // };
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

      bindTerminal(this.term, this.ws, true, -1);
      bindTerminalResize(this.term, this.ws);
    },

  },


}
</script>

<style >


</style>