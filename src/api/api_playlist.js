import { get, post } from '@/request'
/* 获取推荐歌单 */
export const getPersonalized = (limit) => get('/personalized', { limit })

/* 获取歌单详情 */
export const getPlayListDetail = (id) => get('/playlist/detail', { id, timestamp: Date.now() })

/* 获取排行榜信息 */
export const getToplist = () => get('/toplist')

/* 获取歌单分类 */
export const getAllCat = () => get('/playlist/catlist')

/* 获取热门歌单分类 */
export const getHotCat = () => get('/playlist/hot')

/* 根据分类获取歌单 */
export const getPlayListByCat = ({ limit, order, cat, offset }) => get('/top/playlist', { limit, order, cat, offset })

/* 精品歌单标签列表 */
export const getHighqualityTags = () => get('/playlist/highquality/tags')

/* 获取精品歌单 */
export const getHighquality = (limit, cat, before) => get('/top/playlist/highquality', { limit, cat, before })

/* login 获取个性推荐歌单 */
export const getRecommend = () => get('/recommend/resource')

/* 获取歌单收藏者 */
export const getSuberList = ({ id, limit = 30, offset }) => get('/playlist/subscribers', { id, limit, offset })

/* login 收藏/取消收藏歌单 t : 类型,1:收藏,2:取消收藏 */
export const setPlaylistSub = (id, t) => get('/playlist/subscribe', { id, t, timestamp: Date.now() })

/* login 更新歌单信息 */
export const updateMyPlayList = ({ id, name, desc, tags }) => get('/playlist/update', { id, name, desc, tags })

/* login 添加/删除歌曲到自己创建的歌单 op:del/add pid:playlistId  tracks:musicId 用逗号隔开的字符串*/
export const MusicToPlaylist = ({ op, pid, tracks }) => get('/playlist/tracks', { op, pid, tracks })

/* 上传歌单图片 */
export const uploadPlayListImg = ({ id, imgSize, data, imgX = 0, imgY = 0 }) =>
    post(

        `/playlist/cover/update?id=${id}&imgSize=${imgSize}&imgX=${imgX}&imgY=${imgY}&timestamp=${Date.now()}`,
        data,
        {
            'Content-Type': 'multipart/form-data',
        },
    )