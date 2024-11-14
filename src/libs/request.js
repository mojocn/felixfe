import axios from 'axios';
import {Message} from 'element-ui';
import store from "../store";

// 创建axios实例
const service = axios.create({
    //baseURL: 'http://localhost:2222', // api的base_url
    timeout: 120000, // 请求超时时间,
    // request payload
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
    // 修改请求数据,去除data.q中为空的数据项,只针对post请求
});

service.interceptors.request.use(config => {
    store.commit('setLoading',true)
    config.headers['Authorization'] = `Bearer ${store.getters.getJwt}`
    return config;
}, error => {
    store.commit('setLoading',false)

    return Promise.reject(error);
});


// http response 拦截器
service.interceptors.response.use(response => {
        store.commit('setLoading',false)

        if (response.status !== 200) {
            return false
        }
        let {code, data, msg} = response.data;
        if (code === 200) {
            if (response.config.method === 'POST' || response.config.method === 'post') {
                //Message.success("创建成功")
                return true
            } else if (response.config.method === 'DELETE' || response.config.method === 'delete') {
                //Message.success("删除成功")
                return true
            } else if (response.config.method === 'PATCH' || response.config.method === 'patch') {
                //Message.success("更新成功")
                return true
            }
            return data
        } else if (code === 207) { // mojotv cookie 换取 jwt 错误
            //0alert(response)
            Message.warning(msg)
            return false
        } else if (code === 206) { // 参数错误
            Message.warning(msg)
            return false
        } else if (code === 204) { //service 层错误 业务错误
            Message.error(msg)
            return false
        } else if (code === 205) { // 用户中间件错误 缺少jwt token
            //需要 *.mojotv.cn cookie 换取用户信息
            //Message.error(msg)
            return false
        } else if (code === 203) { // ssh-ark jwt cookie 出错 错误  获取mojotv 用户错误
            //alert(msg)
            //let thisURL = encodeURIComponent(location.href)
            //window.location.href = `https://account.mojotv.cn/login?cb=${encodeURIComponent(location.href)}`
            //let to = vueRouter.currentRoute.name
            //vueRouter.push({name: "mojotvAuth", query: {callback: to}})

            return false
        } else {
            //alert(response)
            Message.warning('json code 位置错误')
            return false
        }
    },
    error => {
        store.commit('setLoading',false)

        Message.error(`网络错误`);
        return Promise.reject(error.response.data)

    }
)


export default service


