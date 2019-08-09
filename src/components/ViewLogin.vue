<template>

    <div>
        <canvas ref="nes" width="256" height="240" class="game" @click="toggleForm">
        </canvas>
        <el-form :model="form"
                 ref="form"
                 v-show="isShowForm"
                 class="login">

            <h2>Login to Felix-Ssh2ws</h2>

            <el-form-item prop="user">
                <el-input v-model="form.username" prefix-icon="el-icon-user-solid"
                          placeholder="username or email"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="form.password" prefix-icon="el-icon-c-scale-to-original"
                          show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           style="width:100%;"
                           :loading="loading"
                           v-on:keyup.enter="handleLogin"
                           @click.native.prevent="handleLogin">
                    Login
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import * as jsnes from "jsnes"


    //const canvas_id = "nes-canvas";
    let SCREEN_WIDTH = 256;//256;
    let SCREEN_HEIGHT = 240;//240
    let FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;

    let canvas_ctx, image;
    let framebuffer_u8, framebuffer_u32;

    let AUDIO_BUFFERING = 512;
    let SAMPLE_COUNT = 4 * 1024;
    let SAMPLE_MASK = SAMPLE_COUNT - 1;
    let audio_samples_L = new Float32Array(SAMPLE_COUNT);
    let audio_samples_R = new Float32Array(SAMPLE_COUNT);
    let audio_write_cursor = 0, audio_read_cursor = 0;

    let nes = new jsnes.NES({
        onFrame: function (framebuffer_24) {
            for (let i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
        },
        onAudioSample: function (l, r) {
            audio_samples_L[audio_write_cursor] = l;
            audio_samples_R[audio_write_cursor] = r;
            audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
        },
    });

    function onAnimationFrame() {
        window.requestAnimationFrame(onAnimationFrame);
        image.data.set(framebuffer_u8);
        canvas_ctx.putImageData(image, 0, 0);
        nes.frame();
    }

    function audio_remain() {
        return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
    }

    function audio_callback(event) {
        let dst = event.outputBuffer;
        let len = dst.length;

        // Attempt to avoid buffer underruns.
        if (audio_remain() < AUDIO_BUFFERING) nes.frame();

        let dst_l = dst.getChannelData(0);
        let dst_r = dst.getChannelData(1);
        for (let i = 0; i < len; i++) {
            let src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
            dst_l[i] = audio_samples_L[src_idx];
            dst_r[i] = audio_samples_R[src_idx];
        }

        audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
    }

    function keyboard(callback, event) {
        let player = 1;
        switch (event.key) {
            case "w": // w UP
                callback(player, jsnes.Controller.BUTTON_UP);
                break;
            case "s": // s Down
                callback(player, jsnes.Controller.BUTTON_DOWN);
                break;
            case "a": // a Left
                callback(player, jsnes.Controller.BUTTON_LEFT);
                break;
            case "d": // s Right
                callback(player, jsnes.Controller.BUTTON_RIGHT);
                break;
            case "u": // u 'a' - qwerty, dvorak
            case "j": // j 'q' - azerty
                callback(player, jsnes.Controller.BUTTON_B);
                break;
            case "i": // i's' - qwerty, azerty
            case "k": // k 'o' - dvorak
                callback(player, jsnes.Controller.BUTTON_A);
                break;
            case "z": // z
                callback(player, jsnes.Controller.BUTTON_SELECT);
                break;
            case "x": // x
                callback(player, jsnes.Controller.BUTTON_START);
                break;
            default:
                break;
        }
    }

    // function nes_init(canvas_id) {
    //     let canvas = document.getElementById(canvas_id);
    //     canvas_ctx = canvas.getContext("2d");
    //     image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    //
    //     canvas_ctx.fillStyle = "black";
    //     canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    //
    //     // Allocate framebuffer array.
    //     let buffer = new ArrayBuffer(image.data.length);
    //     framebuffer_u8 = new Uint8ClampedArray(buffer);
    //     framebuffer_u32 = new Uint32Array(buffer);
    //
    //     // Setup audio.
    //     let audio_ctx = new window.AudioContext();
    //     let script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
    //     script_processor.onaudioprocess = audio_callback;
    //
    //     script_processor.connect(audio_ctx.destination);
    // }

    function nes_boot(rom_data) {
        nes.loadROM(rom_data);
        window.requestAnimationFrame(onAnimationFrame);
    }

    // function nes_load_data(canvas_id, rom_data){
    //     nes_init(canvas_id);
    //     nes_boot(rom_data);
    // }


    export default {
        data() {
            return {
                isShowForm: true,
                script_processor: null,
                audio_ctx: null,
                github_client_id: "",
                github_client_secret: "",
                captcha_id: "",
                captcha_value: "",
                captcha_img: "",
                loading: false,
                form: {
                    username: 'admin',
                    password: 'admin'
                }
            };
        },
        computed: {
            sid() {
                const urlParams = new URLSearchParams(window.location.search);
                const myParam = urlParams.get('sid');
                return myParam || false;
            },
            ref() {
                return `${window.location.origin}${window.location.pathname}${window.location.hash}`
            },
            code() {
                const urlParams = new URLSearchParams(window.location.search);
                const myParam = urlParams.get('code');
                return myParam || false;
            },
        },
        mounted() {

            this.nesStart();
            //使用 360 SSO 登陆
            //这个方法没有起作用
            if (this.sid) {
                let data = {end: "https://login.ops.qihoo.net:4436/sec/login", sid: this.sid, ref: this.ref};
                this.$http.post('login-360', data).then(res => {
                    if (res) {
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("expire_ts", res.data.expire_ts);
                        localStorage.setItem("expire", res.data.expire);
                        this.$store.commit('setUser', res.data);
                        this.$router.push({name: "machine"});
                    }
                    this.loading = false;
                })
            }
        },
        beforeDestroy() {
            this.nesClose()
        },
        methods: {
            toggleForm() {
                this.isShowForm = !this.isShowForm;
                if (!this.isShowForm) {
                    this.$notify({
                        title: '手柄1',
                        message: '左:a  上:w  右:d  下:s A:(i,k) B:(u,j) Select:z Start:x',
                        duration: 6000,
                    });
                }
                //this.nesStart()
            },
            nesStart() {
                //let canvas = document.getElementById(canvas_id);
                document.addEventListener('keydown', (event) => {
                    keyboard(nes.buttonDown, event)
                });
                document.addEventListener('keyup', (event) => {
                    keyboard(nes.buttonUp, event)
                });
                let canvas = this.$refs.nes;
                canvas_ctx = canvas.getContext("2d");
                image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

                canvas_ctx.fillStyle = "black";
                canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

                // Allocate framebuffer array.
                let buffer = new ArrayBuffer(image.data.length);
                framebuffer_u8 = new Uint8ClampedArray(buffer);
                framebuffer_u32 = new Uint32Array(buffer);

                // Setup audio.
                // this.audio_ctx = new window.AudioContext();
                // this.script_processor = this.audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
                // this.script_processor.onaudioprocess = audio_callback;
                // this.script_processor.connect(this.audio_ctx.destination);
                //todo:: 修复声音

                let req = new XMLHttpRequest();
                let games = ['contra', "sd", 'smb'];
                let name = games[Math.floor(Math.random() * games.length)];
                let path = `/${name}.nes`;
                req.open("GET", path);
                req.overrideMimeType("text/plain; charset=x-user-defined");
                req.onerror = () => {
                    this.$message.error("load nes file failed")
                };
                req.onload = function () {
                    if (this.status === 200) {
                        nes_boot(this.responseText);
                    } else if (this.status === 0) {
                        // Aborted, so ignore error
                    } else {
                        req.onerror();
                    }
                };
                req.send();
            },
            nesClose() {
                document.removeEventListener("keydown");
                document.removeEventListener("keyup");
                this.script_processor.disconnect(this.audio_ctx.destination);
                this.script_processor = null;
                this.audio_ctx.close();
                this.audio_ctx = null
            },

            fetchGithubUserLoginByCodeOrDoNothing() {
                //使用github Oauth登陆
                if (this.code) {
                    let data = {code: this.code};
                    this.$http.get('login-github', {params: data}).then(res => {
                        if (res) {
                            localStorage.setItem("token", res.data.token);
                            localStorage.setItem("expire_ts", res.data.expire_ts);
                            localStorage.setItem("expire", res.data.expire);
                            this.$store.commit('setUser', res.data);
                            this.$router.push({name: "machine"});
                        }
                    })
                }
            },
            handleLogin() {
                this.loading = true;
                this.$http.post('api/login', this.form).then(res => {
                    if (res) {
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("expire_ts", res.data.expire_ts);
                        localStorage.setItem("expire", res.data.expire);
                        localStorage.setItem("user", JSON.stringify(res.data));
                        this.$router.push({name: "ssh"});
                    }
                    this.loading = false;
                })
            },
        }
    }

</script>

<style scoped>
    .el-form-item__content {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100%
    }

    .game {
        position: fixed;
        width: 100%;
        height: 100%;
    }

    .login {
        box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
        width: 517px;
        height: 325px;
        background-color: white;
        padding: 2rem 2rem 0 2rem;
        margin: auto;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    form > h2 {
        font-size: 26px;
        font-weight: 400;
        margin: 0 auto 20px;
        text-align: center;
        font-weight: 700;
    }
</style>
