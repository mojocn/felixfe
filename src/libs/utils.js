import axios from "axios";
import config from "@/config/config";
// import config from '../config/config'

let util = {};
util.title = function(title) {
  title = title ? title + " - SSH Web Console" : "SSh Web Console";
  window.document.title = title;
};

// url: relative url starting with '/'
util.loadUrl = function(url, params) {
  url = config.net.protocol + config.net.host + url + config.net.midParams;
  return params ? url + "?" + params : url;
};

// url: relative url starting with '/'
util.loadWebSocketUrl = function(url, params) {
  const protocol = config.net.webSocketProtocol;
  url = protocol + config.net.host + url + config.net.midParams;
  return params ? url + "?" + params : url;
};

// const ajaxUrl = config.env === 'development' ?
//     'http://127.0.0.1:80' :
//     config.env === 'production' ?
//     'http://' + util.config.Domain:
//     'https://debug.url.com'; //todo

util.axiosInstance = axios.create({
  timeout: 30000,
  transformRequest: [
    function(data) {
      // Do whatever you want to transform the data
      let ret = "";
      for (let it in data) {
        ret +=
          encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
      }
      return ret;
    }
  ],
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
});

export default util;
