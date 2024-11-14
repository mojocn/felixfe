<template>
  <div>
    <div ref="terminal" class="terminal"></div>
    <el-row class="footer" type="flex" justify="space-between" align="middle">
      <el-col :lg="4" style="display: flex;justify-content: space-around" :xs="8" :sm="6" :md="5">
        <el-button size="mini" type="success" @click="doPlay" :disabled="action==='play'">Play</el-button>
        <el-button size="mini" type="primary" @click="doPause" :disabled="action!=='play'">Pause</el-button>
        <el-input-number size="mini" v-model="speedMs" step-strictly :min="100" :max="10000" :step="100" title="速度(ms/op)"></el-input-number>
      </el-col>
      <el-col :lg="18" :xs="10" :sm="12" :md="16">
        <el-slider
            style="margin: 0 1rem;"
            v-model="frameIndex"
            :step="1"
            :max="frames.length"
            @change="doSlider"
            show-stops>
        </el-slider>
      </el-col>

      <el-col :lg="2" style="display: flex;justify-content: space-evenly" :xs="6" :sm="4" :md="3">
        <el-tag v-text="timeLabel" size="mini" style="margin: auto 0 auto auto"></el-tag>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';

import "xterm/css/xterm.css"

function timeConverter(ts) {
  let a = new Date(ts * 1000);
  //let year = a.getFullYear();
  let month = a.getMonth();
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time = month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const opPing = 3;
// MsgOperation_Stdin   MsgOperation = 0 //pty stdin
// MsgOperation_Stdout  MsgOperation = 1 //pyt stdout
// MsgOperation_Resize  MsgOperation = 2 //pty screen resize
// MsgOperation_Ping    MsgOperation = 3 //websocket ping
// MsgOperation_Warning MsgOperation = 4 //filter find danger cmd line warning message
//todo:: fixed
export default {
  props: {id: String},
  name: 'ViewTermPlayer',
  data() {
    return {
      action: "",
      speedMs: 200,
      timeLabel: '88:55',
      frameIndex: 0,
      row: {},
      frames: [],
      term: null,
      fitAddon: null,
    };
  },

  mounted() {
    this.$http.get("/api/terminal-log/" + this.id).then(data => {
      this.row = data
      this.frames = this._parseFrames()
      this._termInit()
    })
  },
  beforeDestroy() {
    if (this.term) {
      this.term.dispose()
    }
    this.term = null
  },
  methods: {
    doPlay() {
      this.action = 'play'
      this._play()
    },
    doPause() {
      this.action = 'pause'
    },


    async _play() {
      for (let i = this.frameIndex; i < this.frames.length; i++) {
        if (this.action === 'pause') {
          return
        }
        if (this.action === 'stop') {
          return
        }

        this.frameIndex = i
        let frame = this.frames[i]
        this._renderTermFrame(frame)
        await sleep(this.speedMs)
      }

      await sleep(2000)
      this.frameIndex = 0
      this.term.reset()
      this.term.scrollToTop()
    },
    doSlider() {
      this.action = 'stop'
      this.term.reset()
      this.term.scrollToTop()
      for (let i = 0; i < this.frameIndex; i++) {
        let frame = this.frames[i]
        this._renderTermFrame(frame)
      }
    },
    _parseFrames() {
      try {
        let list = JSON.parse(this.row.file_content)
        return list.filter(v => {
          if (v.operation !== opPing) {
            return true
          }
        })
      } catch (e) {
        console.log(e)
        return []
      }
    },
    _termInit() {
      const fitAddon = new FitAddon();
      let term = new Terminal({
        disableStdin: true,
        fontSize: 14,
        cursorBlink: false,
        cursorStyle: 'bar',
        bellStyle: "sound",
        fontFamily: 'Consolas,Menlo,Courier,monospace',
      });
      term.loadAddon(fitAddon);
      term.open(this.$refs.terminal);
      fitAddon.fit(); // first resizing
      term.clear();
      this.fitAddon = fitAddon
      this.term = term

    },
    _renderTermFrame({cols, rows, operation, ts, data}) {
      this.timeLabel = timeConverter(ts)
      if (operation === 0) {
        this.term.write(data)
      } else if (operation === 1) {
        this.term.write(data)
      } else if (operation === 2) {
        this.term.resize(cols, rows)
        this.fitAddon.fit()
      }
    },

    doLink(ev, url) {
      if (ev.type === 'click') {
        window.open(url)
      }
    },
  },
};
</script>
<style scoped>
.footer {
  height: 80px;
  width: 100%;
}

.terminal {
  margin: 0;
  height: calc(100vh - 80px);
}
</style>
