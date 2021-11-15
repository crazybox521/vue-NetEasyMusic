import Vue from "vue";
import Vuex from 'vuex'

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
    /* 轮播图的高度 */
    bannerHeight: 200,
    isLogin: false,
    /* 账号信息 */
    account: {},
    /* 用户信息 */
    profile: {}

}

const mutations = {
    setMusicList(state, musicList) {
        state.musicList = musicList
    },
    setPlayState(state, isPlay) {
        state.isPlay = isPlay
    },
    setCurrenMusicId(state, currenMusicId) {
        state.currenMusicId = currenMusicId
    },
    setCurrenIndex(state, currenIndex) {
        state.currenIndex = currenIndex
    },
    setDrawerMusicList(state, drawerMusicList) {
        state.drawerMusicList = drawerMusicList
    },
    setTotalTime(state, totalTime) {
        state.currenMusicInfo.totalTime = totalTime
    },
    setCurrenTime(state, currenTime) {
        state.currenMusicInfo.currenTime = currenTime
    },
    setBannerHeight(state, bannerHeight) {
        state.bannerHeight = bannerHeight
    },
    setIsLogin(state, isLogin) {
        state.isLogin = isLogin
    },
    setLoginInfo(state, loginInfo) {
        state.account = loginInfo.account
        state.profile = loginInfo.profile
    }
}

const store = new Vuex.Store({
    state,
    mutations
})

export default store