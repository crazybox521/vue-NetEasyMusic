import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import './plugins/my-element'

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
  beforeCreate() {
    // 有关浏览器类型的信息都藏在USER-AGENT里面，首先读取navigator.userAgent里面的信息，为了方便利用toLowerCase方法转成小写的形式
    var sUserAgent = navigator.userAgent.toLowerCase();
    //调用match方法进行匹配属于哪一类浏览器，一下判断都是移动端浏览器
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    //如果匹配上面的浏览器就跳转打开移动端页面
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      //如果是移动端就跳转打开移动端页面
      location = 'https://www.baidu.com';
    } else {
      //Pc端进入不需要其他操作
    }
  }
}).$mount('#app')