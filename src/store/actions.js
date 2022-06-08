import Vue from "vue";
import { getPersonalFm, fmTrash, getLikeIdList } from '@/api/api_music'
import { getAcount, logout, getUserPlayList } from '@/api/api_user'
import { getIp } from "@/request";
import router from '@/router/index'
export default {
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
    },
    async getAcount({ commit, dispatch }) {
        /* 获取登录信息 */
        const res = await getAcount()
        if (res.code !== 200) return
        if (res.account !== null) {
            commit('setLoginInfo', res)
            commit('setIsLogin', true)
            dispatch('getMyPlayList')
            dispatch('getLikeList')
        } else {
            commit('setLoginInfo', { account: {}, profile: {} })
            commit('setIsLogin', false)
            Vue.prototype.$notify({
                title: '登录体验完整功能',
                type: 'warning',
                dangerouslyUseHTMLString: true,
                message:
                    `<section>部分功能需要登录后才能使用，如每日推荐等，点击头像可以登录,建议使用二维码登录</section>`,
                duration: 0,
                position: 'top-left'
            })
            Vue.prototype.$notify({
                title: 'IP已被限制',
                type: 'warning',
                dangerouslyUseHTMLString: true,
                message:
                    `<section>服务器IP已被限制，未登录情况下已无法正常使用，登陆后正常，或将前后端项目都克隆到本地运行进行预览</section>
                     <br/>
                    <section>点击访问<a style="margin:0 10px" href="https://gitee.com/crazybox521/vue-music" target="_blank">Gitee</a><a href="https://github.com/crazybox521/vue-NetEasyMusic" target="_blank">GitHub</a></section>
                    `,
                duration: 0,
                offset:120,
                position: 'top-left'
            })
        }
    },
    logout({ commit, state }) {
        /* 退出登录 */
        if (!state.isLogin) return Vue.prototype.$message.warning('似乎并没有登录')
        Vue.prototype.$confirm('将要退出登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                const res = await logout()
                if (res.code !== 200) return
                Vue.prototype.$message.success('退出成功')
                commit('setLoginInfo', { account: null, profile: null })
                commit('setIsLogin', false)
                /* Vue.prototype.$router.push('/') */
                router.push('/')
            })
            .catch((err) => {
                console.log(err);
                Vue.prototype.$message({
                    type: 'info',
                    message: '已取消'
                })
            })

    },
    /* 获取喜欢的音乐列表 */
    async getLikeList({ commit, state }) {
        const res = await getLikeIdList(state.profile.userId)
        if (res.code !== 200) return
        if (res.ids instanceof Array) {
            commit('setLikeIdList', {
                type: 'get',
                data: res.ids
            })
        }
    },
    /* 获取个人歌单 */
    async getMyPlayList({ commit, state }) {
        if (!state.isLogin) return
        const res = await getUserPlayList(state.profile.userId)
        if (res.code !== 200) return
        commit('setMyPlayList', res.playlist)
    },

    async getRealIP({ commit }) {
        try {
            const res = await getIp()
            let arr = res.data.match(/[0-9]+(\.[0-9]+)+/)
            let ip =arr?arr[0]:''
            console.log(ip);
            commit('setIp', ip)
        } catch (error) {
            console.log(error);
        }


    }
}