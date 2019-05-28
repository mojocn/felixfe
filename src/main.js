import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import ElementUI from 'element-ui';
import service from "./libs/request";
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/styles/index.scss' // global css

Vue.use(ElementUI);
Vue.prototype.$http = service;


Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
