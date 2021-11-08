import axios from "axios";
import NProgress from 'nprogress'
/* 根路径 */
axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/* 配置拦截器，在config中给header添加Authorization */
axios.interceptors.request.use((config) => {
    NProgress.start();
    config.headers.Authorization = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
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
export const getToplist=() => {
    return axios.get('/toplist')
}