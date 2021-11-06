import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    musicList: [],
    isPlay: false,
    currenMusicId: 0,
    currenIndex:0
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
    }
}

const store = new Vuex.Store({
    state,
    mutations
})

export default store