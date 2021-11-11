import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

/* import './plugins/my-element' */

import './assets/css/global.css'
import './assets/css/my-element.css'

Vue.config.productionTip = false

/* 歌曲时长的过滤器 */
Vue.filter('timeFormat', function (time) {
  let minutes = parseInt(time / 60); // 获取时长分钟
  let seconds = parseInt(time % 60); // 获取时长秒数
  seconds = seconds < 10 ? '0' + seconds : seconds // 秒
  minutes = minutes < 10 ? '0' + minutes : minutes
  return minutes + ':' + seconds
})

/* 时间的过滤器 */
Vue.filter('dateFormat', function (time) {
  const t = new Date(time)
  let year = t.getFullYear()
  let mouth = t.getMonth() + 1
  let day = t.getDay()
  mouth = mouth < 10 ? '0' + mouth : mouth
  day = day < 10 ? '0' + day : day
  return year + '-' + mouth + '-' + day
})

Vue.filter('countFormat', function (count) {
  if (count < 10000) return count
  else return Math.floor(count / 10000) + '万'
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')