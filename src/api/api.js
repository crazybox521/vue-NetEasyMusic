import axios from "axios";
import NProgress from 'nprogress'
/* 根路径 */
// axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/* 配置拦截器，在config中给header添加Authorization */
axios.interceptors.request.use((config) => {
    NProgress.start();
    /*  config.headers.Authorization = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '' */
    return config
})

axios.interceptors.response.use((config) => {
    NProgress.done();
    return config
})

/* 检索歌曲 
 * params:
 * key,limit,offset,type
 *
 */
export const search = (seachInfo) => {
    return axios.get('/cloudsearch', {
        params: seachInfo
    })
}

export const checkMusic = () => {

}

/* 获取音乐url 
 * params
 * id
 */
export const getMusicUrl = (id) => {
    return axios.get('/song/url', {
        params: {
            id
        }
    })
}

/* 获取轮播图 */
export const getBanner = () => {
    return axios.get('/banner')
}

/* 获取推荐歌单 */
export const getPersonalized = (limit) => {
    return axios.get('/personalized', {
        params: {
            limit
        }
    })
}

/* 获取歌单详情 */
export const getPlayListDetail = (id) => {
    return axios.get('/playlist/detail', {
        params: {
            id
        }
    })
}

/* 获取音乐详情 */
export const getMusicListByIds = (ids) => {
    return axios.get('/song/detail', {
        params: {
            ids
        }
    })
}

/* 获取排行榜信息 */
export const getToplist = () => {
    return axios.get('/toplist')
}

/* 获取歌单分类 */
export const getAllCat = () => {
    return axios.get('/playlist/catlist')
}

/* 获取热门歌单分类 */
export const getHotCat = () => {
    return axios.get('/playlist/hot')
}

/* 根据分类获取歌单 */
export const getPlayListByCat = (obj) => {
    const { limit, order, cat, offset } = obj
    return axios.get('/top/playlist', {
        params: {
            limit, order, cat, offset
        }
    })
}

/* 精品歌单标签列表 */
export const getHighqualityTags = () => {
    return axios.get('/playlist/highquality/tags')
}

/* 获取精品歌单 */
export const getHighquality = (limit, cat, before) => {
    return axios.get('/top/playlist/highquality', {
        params: {
            limit, cat, before
        }
    })
}

/* 获取歌手列表 */
export const getArtistList = (obj) => {
    return axios.get('/artist/list', {
        params: obj
    })
}

/* 根据ID获取歌手详情 */
export const queryArtistDetail = (id) => {
    return axios.get('/artist/detail', {
        params: {
            id
        }
    })
}

/* 获取歌手热门50首 */
export const getArtistTop = (id) => {
    return axios.get('/artist/top/song', {
        params: {
            id
        }
    })
}

/* 获取歌手专辑 */
export const getArtistAlbum = (id, limit=50, offset = 0) => {
    return axios.get('/artist/album', {
        params: {
            id, limit, offset
        }
    })
}

/* 获取专辑内容 */
export const getAlbumDetail =(id) => {
    return axios.get('/album',{
        params:{
            id
        }
    })
}

/* 获取歌手描述 */
export const getIntro=(id) => {
    return axios.get('/artist/desc',{
        params:{
            id
        }
    })
}

/* 手机号密码登录 */
export const doLoginByPhone =(phone,md5_password) => {
    return axios.get('/login/cellphone',{
        params:{
            phone,md5_password
        }
    })
}

/* 获取登录状态 */
export const getLoginStatus =() => {
    return axios.get('/login/status')
}

/* 获取账号信息 */
export const getAcount =() => {
    return axios.get('/user/account')
}

/* 获取日推歌单 */
export const getRecommend=() => {
    return axios.get('/recommend/resource')
}