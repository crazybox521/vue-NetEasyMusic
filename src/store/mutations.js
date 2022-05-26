export default{
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
    },
    setMyPlayList(state, list) {
        state.myPlayList = list
    },
    setIp(state,ip){
        state.ip =ip
    }
}