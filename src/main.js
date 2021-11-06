import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import './config/elementConfig'

import './assets/css/global.css'

Vue.config.productionTip = false

Vue.filter('timeFormat', function (time) {
  let minutes = parseInt(time / 60); // 获取时长分钟
  let seconds = parseInt(time % 60); // 获取时长秒数
  seconds = seconds < 10 ? '0' + seconds : seconds // 秒
  minutes = minutes < 10 ? '0' + minutes : minutes
  return minutes + ':' + seconds
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')