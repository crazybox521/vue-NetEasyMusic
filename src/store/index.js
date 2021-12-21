import Vue from "vue";
import Vuex from 'vuex'
import { getPersonalFm, fmTrash } from '@/api/api_music'

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
    playType: 'music'//music,personalFm

}
const actions = {
    /* 私人FM */
    async personalFm({ commit, state, dispatch }, operate) {
        /* {type,id} */
        if (operate.type === 'get') {
            const res = await getPersonalFm()
            if (res.code !== 200) return Vue.prototype.$message.error('获取私人FM失败')
            const list = []

            res.data.forEach(item => {
                list.push({
                    id: item.id,
                    name: item.name,
                    fee: item.fee,
                    alia: item.alias,
                    ar: item.artists,
                    al: item.album,
                    dt: item.duration,
                    mv: item.mvid
                })
            })
            commit('setPersonalFm', { type: 'set', data: list })
            commit('setPlayType', 'personalFm')
            commit('setPlayState', true)
        } else if (operate.type === 'next') {
            if (state.musicList.length - 1 === state.currenIndex) {
                dispatch('personalFm', { type: 'get' })
            } else {
                commit('setPersonalFm', { type: 'next' })
            }
        } else if (operate.type === 'remove') {
            const res = await fmTrash(operate.id)
            if (res.code !== 200) return Vue.prototype.$message.error('操作失败')
            Vue.prototype.$message.success('成功移到垃圾桶')
            dispatch('personalFm', { type: 'next' })
        }
    },
    /* music */
    playMusic({ commit }, payload) {
        /* payload :{list,id} */
        commit('setMusicList', payload.list)
        commit('setCurrenMusicId', payload.id)
        let index = payload.list.findIndex((item) => item.id == payload.id)
        commit('setCurrenIndex', index)
        commit('setPlayType', 'music')
        commit('setPlayState', true)
    }
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
    setIsPhone(state, isPhone) {
        state.isPhone = isPhone
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
        else if (payload.type === 'get') {
            state.historyList = payload.data
            return
        }
        else if (payload.type === 'clear') {
            state.historyList = []
            window.localStorage.removeItem('historylist')
            return
        }
    },
    setLikeIdList(state, payload) {
        if (payload.type === 'get') {
            state.likeIdList = payload.data
        } else if (payload.type === 'unshift') {
            state.likeIdList.unshift(payload.data)
        } else if (payload.type === 'remove') {
            state.likeIdList.splice(
                state.likeIdList.indexOf(payload.data), 1
            )
        }
    },
    setPersonalFm(state, payload) {
        if (payload.type === 'set') {
            state.musicList = payload.data
            state.currenIndex = 0
            state.currenMusicId = payload.data[0].id

        } else if (payload.type === 'next') {
            state.currenIndex++
            state.currenMusicId = state.musicList[state.currenIndex].id
        }
    },
    setPlayType(state, playType) {
        if (playType === 'music' || playType === 'personalFm') {
            state.playType = playType
        }
    }

}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store