<template>
    <div>
        <p class="control">
            <el-tag type="success">a -> left</el-tag>
            <el-tag type="success">s -> down</el-tag>
            <el-tag type="success">d -> right</el-tag>
            <el-tag type="success">w -> up</el-tag>

            <el-tag type="info">u/j -> A</el-tag>
            <el-tag type="info">i/k -> B</el-tag>
            <el-tag type="warning">z -> SELECT</el-tag>
            <el-tag type="warning">x -> START</el-tag>
        </p>
        <canvas id="nes-canvas" width="256" height="240" style="width: 50%"/>
    </div>
</template>

<script>
    import * as jsnes from "jsnes"

    const canvas_id = "nes-canvas";
    let SCREEN_WIDTH = 256;
    let SCREEN_HEIGHT = 240;
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
            for (var i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
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
        var len = dst.length;

        // Attempt to avoid buffer underruns.
        if (audio_remain() < AUDIO_BUFFERING) nes.frame();

        let dst_l = dst.getChannelData(0);
        let dst_r = dst.getChannelData(1);
        for (var i = 0; i < len; i++) {
            var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
            dst_l[i] = audio_samples_L[src_idx];
            dst_r[i] = audio_samples_R[src_idx];
        }

        audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
    }

    function keyboard(callback, event) {
        var player = 1;
        switch (event.keyCode) {
            case 87: // w UP
                callback(player, jsnes.Controller.BUTTON_UP);
                break;
            case 83: // s Down
                callback(player, jsnes.Controller.BUTTON_DOWN);
                break;
            case 65: // a Left
                callback(player, jsnes.Controller.BUTTON_LEFT);
                break;
            case 68: // s Right
                callback(player, jsnes.Controller.BUTTON_RIGHT);
                break;
            case 85: // u 'a' - qwerty, dvorak
            case 74: // j 'q' - azerty
                callback(player, jsnes.Controller.BUTTON_B);
                break;
            case 73: // i's' - qwerty, azerty
            case 75: // k 'o' - dvorak
                callback(player, jsnes.Controller.BUTTON_A);
                break;
            case 90: // z
                callback(player, jsnes.Controller.BUTTON_SELECT);
                break;
            case 88: // x
                callback(player, jsnes.Controller.BUTTON_START);
                break;
            default:
                break;
        }
    }

    function nes_init(canvas_id) {
        var canvas = document.getElementById(canvas_id);
        canvas_ctx = canvas.getContext("2d");
        image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        canvas_ctx.fillStyle = "black";
        canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // Allocate framebuffer array.
        var buffer = new ArrayBuffer(image.data.length);
        framebuffer_u8 = new Uint8ClampedArray(buffer);
        framebuffer_u32 = new Uint32Array(buffer);

        // Setup audio.
        var audio_ctx = new window.AudioContext();
        var script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
        script_processor.onaudioprocess = audio_callback;

        script_processor.connect(audio_ctx.destination);
    }

    function nes_boot(rom_data) {
        nes.loadROM(rom_data);
        window.requestAnimationFrame(onAnimationFrame);
    }

    // function nes_load_data(canvas_id, rom_data){
    //     nes_init(canvas_id);
    //     nes_boot(rom_data);
    // }
    export default {
        name: 'ViewNes',
        data() {
            return {
                script_processor: null,
                audio_ctx: null,
            };
        },
        created() {
            document.addEventListener('keydown', (event) => {
                keyboard(nes.buttonDown, event)
            });
            document.addEventListener('keyup', (event) => {
                keyboard(nes.buttonUp, event)
            });
        },
        mounted() {
            let canvas = document.getElementById(canvas_id);
            canvas_ctx = canvas.getContext("2d");
            image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

            canvas_ctx.fillStyle = "black";
            canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

            // Allocate framebuffer array.
            let buffer = new ArrayBuffer(image.data.length);
            framebuffer_u8 = new Uint8ClampedArray(buffer);
            framebuffer_u32 = new Uint32Array(buffer);

            // Setup audio.
            this.audio_ctx = new window.AudioContext();
            this.script_processor = this.audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
            //this.script_processor.addEventListener(AudioProcessingEvent,audio_callback )
            this.script_processor.onaudioprocess = audio_callback;

            //script_processor.addEventListener("AudioProcessingEvent",audio_callback)
            this.script_processor.connect(this.audio_ctx.destination);


            let req = new XMLHttpRequest();
            let path = "/sd.nes";
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
        beforeDestroy() {
            this.script_processor.disconnect();
            this.script_processor = null;
        },
        methods: {}
    };
</script>
<style scoped>
    p.control > span {
        margin-left: 1rem;
    }
</style>
