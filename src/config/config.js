let config = {};

config.wsBase = `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}`
config.apiBase = `${window.location.protocol}//:${window.location.host}`

export default config;
