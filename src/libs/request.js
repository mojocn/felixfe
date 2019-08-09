import axios from 'axios';
import {Message, MessageBox} from 'element-ui';
import vueRouter from "../router";


// 创建axios实例
const service = axios.create({
    //baseURL: 'http://localhost:2222', // api的base_url
    timeout: 10000, // 请求超时时间,
    // request payload
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
    // 修改请求数据,去除data.q中为空的数据项,只针对post请求
});

service.interceptors.request.use(config => {

    //过滤 登陆请求
    if (config.url.includes('login') || config.url.includes("api/meta")) {
        return config
    }
    let expire_ts = localStorage.getItem('expire_ts');
    if (expire_ts && parseInt(expire_ts) < (Date.now() / 1000)) {
        return Promise.reject({code: 1, msg: "token has been expired", title: "Token Expire"})
    }
    let token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject({code: 1, msg: "felix has no token jump to login page", title: "No Token"})
    }
    config.headers['Authorization'] = 'Bearer ' + token; // 让每个请求携带自定义token 请根据实际情况自行修改
    return config;
}, error => {
    // 对请求错误做些什么
    Message.error("sending request is failed");
    // let loading = Loading.service({target:'#felix'});
    // loading.close();    //关闭加载前，记得重新定义实例
    return Promise.reject(error);
});

// http response 拦截器
service.interceptors.response.use(response => {
        let res = response.data;
        if (res.ok) {
            return res
        }
        Message.warning(res.msg);
        return false;
    },
    error => {
        if (error.code === 1) {
            MessageBox.confirm(error.msg, error.title, {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                vueRouter.push({name: "login"})
            });
            return Promise.reject(null)
        }
        if (error.response && error.response.status === 412) {

            MessageBox.confirm('token is invalid', 'jump to login', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                vueRouter.push({name: "login"})
            });
            return Promise.reject(null)
        }
        if (error.response && error.response.status === 200) {
            let data = error.response.data;
            if (!data.ok) {
                Message.warning(data.msg)
            }
            return
        }
        Message.error(`http response error code: ${error.response.status}`);
        return Promise.reject(error.response.data)

    });


export default service
