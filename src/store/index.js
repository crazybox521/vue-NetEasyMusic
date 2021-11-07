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
    currenIndex:0,
    /* 播放列表抽屉的状态 */
    drawerMusicList:false,
    /* 播放音乐的总时间和当前时间 */
    currenMusicInfo:{
        totalTime:0,
        currenTime:0
    },
    /* 搜索的关键字 */
    keywords:''
}

const mutations = {
    setMusicList(state, payload) {
        state.musicList = payload
    },
    setPlayState(state, payload) {
        state.isPlay = payload
    },
    setCurrenMusicId(state, payload) {
        state.currenMusicId = payload
    },
    setCurrenIndex(state, payload){
        state.currenIndex =payload
    },
    setDrawerMusicList(state,payload){
        state.drawerMusicList=payload
    },
    setTotalTime(state,payload){
        state.currenMusicInfo.totalTime=payload
    },
    setCurrenTime(state,payload){
        state.currenMusicInfo.currenTime=payload
    },
    setKeywords(state,payload){
        state.keywords =payload
    }
}

const store = new Vuex.Store({
    state,
    mutations
})

export default store