import Vue from "vue";
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
Vue.use(Vuex)

const state = {
    /* 播放列表 */
    musicList: [],
    /* 播放状态 */
    isPlay: false,
    /* 当前播放的id */
    currenMusicId: 0,
    /* 当前播放的列表下标 */
    currenIndex: 0,
    /* 播放列表抽屉的状态 */
    drawerMusicList: false,
    /* 播放音乐的总时间和当前时间 */
    currenMusicInfo: {
        totalTime: 0,
        currenTime: 0
    },
    /* 登录态 */
    isLogin: window.sessionStorage.getItem('isLogin') !== 'true' ? false : true,
    /* 账号信息 */
    account: {},
    /* 用户信息 */
    profile: {},
    /* 最近播放列表 */
    historyList: [],
    /* 是否为移动设备 */
    isPhone: false,
    /* 喜欢的音乐列表 */
    likeIdList: [],
    /* 播放类型 */
    playType: 'music',//music,personalFm
    /* 我的歌单，包括创建、收藏 */
    myPlayList: []
}
const getters = {
    createPlaylist(state) {
        // 创建的歌单
        return state.isLogin ? state.myPlayList.filter((item) => item.userId === state.profile.userId) : []
    },
    subscribePlaylist(state) {
        // 收藏的歌单
        return state.isLogin ? state.myPlayList.filter((item) => item.userId !== state.profile.userId) : []
    },
    userId(state) {
        return state.isLogin ? state.profile.userId : 0
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})

export default store