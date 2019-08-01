let config = {};

config.wsBase = `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}`;
config.apiBase = `${window.location.protocol}//:${window.location.host}`;


if (window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1')) {
    //to fix nginx web socket upgrade error
    config.wsBase = "wss://felix.mojotv.cn"
}
export default config;
