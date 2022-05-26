import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import '@/utils/filters'

/* import './plugins/my-element' */

import './assets/css/global.css'
import './assets/css/my-element.css'
import './assets/css/btn.css'
/* Vue.use(window['vue-cropper'].default) */
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
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      this.$store.commit('setIsPhone', true)
    } else {
      //Pc端进入不需要其他操作
      this.$store.commit('setIsPhone', false)
    }
    this.$store.dispatch('getRealIP')
  }
}).$mount('#app')