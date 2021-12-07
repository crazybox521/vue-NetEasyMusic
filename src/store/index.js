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
    isLogin: window.sessionStorage.getItem('isLogin') !== 'true' ? false : true,
    /* 账号信息 */
    account: {},
    /* 用户信息 */
    profile: {},
    /* 是否播放的最近播放 */
    historyList: []

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
        if (isLogin) {
            window.sessionStorage.setItem('isLogin', true)
        } else {
            window.sessionStorage.removeItem('isLogin')
        }

    },
    setLoginInfo(state, loginInfo) {
        state.account = loginInfo.account
        state.profile = loginInfo.profile
    },
    setHistoryList(state, payload) {
        if (payload.type === 'unshift') {
            /* 判断历史播放里是否有重复，这里重复直接不走，也可以删除之前的，再unshift把最新的提到最前面 */
            if (state.historyList.findIndex((item) => item.id == payload.data.id) !== -1)
                return
            state.historyList.unshift(payload.data)
            if (state.historyList.length > 50) {
                state.historyList.splice(-1, 1)
                console.log(state.historyList.length);
            }

            window.localStorage.setItem(
                'historylist',
                JSON.stringify(state.historyList)
            )
            return
        }
        if (payload.type === 'get') {
            state.historyList = payload.data
            return
        }
        if (payload.type === 'clear') {
            state.historyList = []
            window.localStorage.removeItem('historylist')
            return
        }
    }

}

const store = new Vuex.Store({
    state,
    mutations
})

export default store