<template>

  <div ref="terminal" class="felix-xterm"></div>
</template>

<script>
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import "xterm/css/xterm.css"


const MsgType_Resize = 0
const MsgType_Cmd = 1
const MsgType_Beat = 2

export default {
  props: {token: {require: true}},
  name: "XtermView",
  data() {
    return {
      timer: null,
      ws: null,
      term: null,
      fitAddon: null,
    };
  },

  computed: {

    wsUrl() {
      let loc = window.location, new_uri;
      if (loc.protocol === "https:") {
        new_uri = "wss:";
      } else {
        new_uri = "ws:";
      }
      new_uri += "//" + loc.host;
      new_uri += loc.pathname + "ws/term";
      return `${new_uri}?c=${this.term.cols}&r=${this.term.rows}&t=${this.token}`
    }
  },
  mounted() {
    this.doOpened()
  },
  beforeDestroy() {
    this.doClose()
  },
  methods: {
    showAlert() {
      this.$alert('是否关闭当前Tab', 'SSH会话已经结束', {
        confirmButtonText: '确定',
        callback: () => {
          window.close();
        }
      });
    },
    doClose() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
      if (this.term) {
        this.term.setOption("cursorBlink", false);
        this.term.dispose()
        this.term = null
      }
      window.onresize = null
    },

    doOpened() {
      this.fitAddon = new FitAddon();
      this.term = new Terminal({
        //rows: 20,
        fontSize: 16,
        cursorBlink: true,
        cursorStyle: 'bar',
        bellStyle: "sound",
      });
      this.term.writeln('\x1B[1;3;31m欢迎来到网页终端，提示全部SSH活动都被记录. \x1B[0m');
      this.term.loadAddon(this.fitAddon)
      this.term.open(this.$refs.terminal);
      this.fitAddon.fit(); // first resizing
      this.term.focus();

      this.ws = new WebSocket(this.wsUrl);
      //1.
      this.ws.onclose = ce => {
        if (ce.code !== 1005) {
          this.showAlert()
          this.doClose();
        }
      };
      //2.
      this.ws.onerror = ce => {
        if (ce.code !== 1005) {
          this.showAlert()
          this.doClose();
        }
      }
      //3. write ws msg to xtermjs
      this.ws.onmessage = ev => {
        this.term.write(ev.data)
      }


      //4. send ws heart beat
      this.timer = setInterval(() => {
        this.ws.send(JSON.stringify({type: MsgType_Beat}));
      }, 15 * 1000);

      //5. term size change
      this.term.onResize(size => {
        this.ws.send(
            JSON.stringify({
              type: MsgType_Resize,
              rows: size.rows,
              cols: size.cols,
            })
        );
      });


      //6. term send msg
      this.term.onData(data => {
        this.ws.send(
            JSON.stringify({
              type: MsgType_Cmd,
              input: btoa(data) // encode data as base64 format
            })
        );
      });

      //7. watch window size change
      window.onresize = () => {
        this.fitAddon.fit()
      };
    },
  },


}
</script>
<style>


</style>