let config = {};

config.wsBase = `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}`;
config.apiBase = `${window.location.protocol}//:${window.location.host}`;
if (window.location.host.includes('felix.mojotv.cn')) {
    //to fix nginx web socket upgrade error
    config.wsBase = "ws://felix.mojotv.cn:2222"
}
export default config;
