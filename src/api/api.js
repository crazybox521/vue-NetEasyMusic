import axios from "axios";
import NProgress from 'nprogress'
/* 根路径 */
// axios.defaults.baseURL = 'http://localhost:8080';
/* token */
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 3000
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
/* 目前接口数：35 */

/* 检索歌曲 */
export const search = (seachInfo) => axios.get('/cloudsearch', { params: seachInfo })

export const checkMusic = () => {}

/* 获取音乐url */
export const getMusicUrl = (id) => axios.get('/song/url', { params: { id } })

/* 获取音乐歌词 */
export const getLyric = (id) => axios.get('/lyric', { params: { id } })

/* 获取轮播图 */
export const getBanner = () => axios.get('/banner')

/* 获取推荐歌单 */
export const getPersonalized = (limit) => axios.get('/personalized', { params: { limit } })

/* 获取歌单详情 */
export const getPlayListDetail = (id) => axios.get('/playlist/detail', { params: { id } })

/* 获取音乐详情 */
export const getMusicListByIds = (ids) => axios.get('/song/detail', { params: { ids } })


/* 获取排行榜信息 */
export const getToplist = () => axios.get('/toplist')

/* 获取歌单分类 */
export const getAllCat = () => axios.get('/playlist/catlist')


/* 获取热门歌单分类 */
export const getHotCat = () => axios.get('/playlist/hot')


/* 根据分类获取歌单 */
export const getPlayListByCat = (obj) => {
    const { limit, order, cat, offset } = obj
    return axios.get('/top/playlist', { params: { limit, order, cat, offset } })
}

/* 精品歌单标签列表 */
export const getHighqualityTags = () => axios.get('/playlist/highquality/tags')

/* 获取精品歌单 */
export const getHighquality = (limit, cat, before) => axios.get('/top/playlist/highquality', { params: { limit, cat, before } })

/* 获取歌手列表 */
export const getArtistList = (obj) => axios.get('/artist/list', { params: obj })

/* 根据ID获取歌手详情 */
export const queryArtistDetail = (id) => axios.get('/artist/detail', { params: { id } })


/* 获取歌手热门50首 */
export const getArtistTop = (id) => axios.get('/artist/top/song', { params: { id } })


/* 获取歌手专辑 */
export const getArtistAlbum = (id, limit = 50, offset = 0) => axios.get('/artist/album', { params: { id, limit, offset } })

/* 获取专辑内容 */
export const getAlbumDetail = (id) => axios.get('/album', { params: { id } })

/* 获取歌手描述 */
export const getIntro = (id) => axios.get('/artist/desc', { params: { id } })


/* 手机号密码登录 */
export const doLoginByPhone = (phone, md5_password) => axios.get('/login/cellphone', { params: { phone, md5_password } })

/* 退出登录 */
export const logout = () => axios.get('/logout')

/* 获取登录状态 */
export const getLoginStatus = () => axios.get('/login/status')

/* 获取账号信息 */
export const getAcount = () => axios.get('/user/account', { params: { timestamp: Date.now() } })

/* 获取日推歌单 */
export const getRecommend = () => axios.get('/recommend/resource')

/* 日推歌曲 */
export const getRecommendSong = () => axios.get('/recommend/songs')

/* 获取喜欢的音乐ID列表 */
export const getLikeIdList = (uid) => axios.get('/likelist', { params: { uid } })

/* 视频分类 */
export const getVideoAlltag = () => axios.get('/video/group/list')

/* 视频热门分类 */
export const getVideoHotTag = () => axios.get('/video/category/list')

/* 全部视频列表 */
export const getAllVideo = (offset) => axios.get('/video/timeline/all', { params: { offset } })

/* 根据标签获取视频列表 */
export const getVideoByTag = (id, offset) => axios.get('/video/group', { params: { id, offset } })

/* 获取视频详情 */
export const getVideoDetail = (id) => axios.get('/video/detail', { params: { id } })

/* 获取相关视频 */
export const getRelatedVideo = (id) => axios.get('/related/allvideo', { params: { id } })

/* 获取视频点赞评论数据 */
export const getVideoLike = (vid) => axios.get('/video/detail/info', { params: { vid } })

/* 获取视频URL */
export const getVideoUrl = (id) => axios.get('/video/url', { params: { id } })

/* 下载 */
export const downloadMusic = (url, fileName) => {
    axios
        .get(
            url, {
            responseType: "blob"
        })
        .then((res) => {
            let blob = res.data;
            let href = URL.createObjectURL(blob);
            console.log(href);
            let a = document.createElement("a");
            a.href = href;
            a.download = fileName
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        })
        .catch((err) => {
            console.log(err);
            console.log("下载失败,请稍后重试!");
        });

}