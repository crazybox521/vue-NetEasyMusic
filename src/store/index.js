import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    musicList: [],
    isPlay: false,
    currenMusicId: 0,
    currenIndex:0,
    drawerMusicList:false,
    currenMusicInfo:{
        totalTime:0,
        currenTime:0
    },
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