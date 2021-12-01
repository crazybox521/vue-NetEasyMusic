import get from '@/plugins/get'

/* 获取音乐url */
export const getMusicUrl = (id) => get('/song/url', { id })

/* 获取音乐歌词 */
export const getLyric = (id) => get('/lyric', { id })

/* 获取日推歌曲 */
export const getRecommendSong = () => get('/recommend/songs')

/* 获取喜欢的音乐ID列表 */
export const getLikeIdList = (uid) => get('/likelist', { uid })

/* 获取音乐详情 */
export const getMusicListByIds = (ids) => get('/song/detail', { ids })