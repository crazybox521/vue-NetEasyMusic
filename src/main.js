import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import './plugins/my-element'
import './utils/filters'

import './assets/css/global.css'
import './assets/css/my-element.css'
import './assets/css/btn.css'
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)
import VueLazyload from 'vue-lazyload'
 
// Vue.use(VueLazyload)
 
// with options
Vue.use(VueLazyload, {
  preLoad: 1.9,
  error: require('./assets/img/error.jpg'),
  loading:  require('./assets/img/loading.gif'),
  attempt: 3
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    console.log(router);
    // 有关浏览器类型的信息都藏在USER-AGENT里面，首先读取navigator.userAgent里面的信息，为了方便利用toLowerCase方法转成小写的形式
    var sUserAgent = navigator.userAgent.toLowerCase();
    //调用match方法进行匹配属于哪一类浏览器，一下判断都是移动端浏览器
    var bIsIpad = sUserAgent.match(/ipad/i) !== null;
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) !== null;
    var bIsMidp = sUserAgent.match(/midp/i) !== null;
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) !== null;
    var bIsUc = sUserAgent.match(/ucweb/i) !== null;
    var bIsAndroid = sUserAgent.match(/android/i) !== null;
    var bIsCE = sUserAgent.match(/windows ce/i) !== null;
    var bIsWM = sUserAgent.match(/windows mobile/i) !== null;
    //如果匹配上面的浏览器就跳转打开移动端页面
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      //如果是移动端就跳转打开移动端页面
      this.$store.commit('setIsPhone', true)
    } else {
      //Pc端进入不需要其他操作
      this.$store.commit('setIsPhone', false)
    }
  }
}).$mount('#app')