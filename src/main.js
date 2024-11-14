import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/styles/index.scss' // global css
import store from './store';
import {VuePlugin} from './libs/plugin'

Vue.use(VuePlugin)
Vue.use(ElementUI);

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');