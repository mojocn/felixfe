import axios from 'axios'
import {Loading,Message}from 'element-ui'

// function getBaseUrl() {
//     let baseUrl = process.env.BASE_API
//     const hostName = window.location.hostname
//     if (hostName !== 'localhost') {
//         baseUrl = 'http://' + hostName
//     }
//     return baseUrl
// }

// 创建axios实例
const service = axios.create({
    //baseURL: 'http://localhost:2222', // api的base_url
    timeout: 10000, // 请求超时时间,
    // request payload
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    // 修改请求数据,去除data.q中为空的数据项,只针对post请求

})

service.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    //判断是否存在token，如果存在将每个页面header都添加token
    // if (store.state.token) {
    //     config.headers.common['Authentication-Token'] = store.state.token
    // }
    //请求前到请求到数据这段时间用加载动画来代替，以服务方式调用
    // let loading = Loading.service({
    //     //fullscreen: true,
    //     text: '拼命加载中...',
    //     target:'#felix'
    // });
    return config;
}, error => {
    // 对请求错误做些什么
    Message.error("sending request is failed")
    let loading = Loading.service({target:'#felix'});
    loading.close();    //关闭加载前，记得重新定义实例
    return Promise.reject(error);
});

// http response 拦截器
service.interceptors.response.use(response => {
        let data = response.data
        if (data.ok){
            return data;
        }else {
            Message.error(data.msg)
            return {};
        }
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // this.$store.commit('del_token');
                    // router.replace({
                    //     path: '/login',
                    //     query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                    // })
            }
        }

        // let loading = Loading.service({target:'#felix'});
        // loading.close();
        return Promise.reject(error.response.data)

    });


export default service
