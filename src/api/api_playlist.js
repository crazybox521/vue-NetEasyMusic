import get from '@/service/get'
/* 获取推荐歌单 */
export const getPersonalized = (limit) => get('/personalized', { limit })

/* 获取歌单详情 */
export const getPlayListDetail = (id) => get('/playlist/detail', { id, timestamp:Date.now() })

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

/* 获取日推歌单 */
export const getRecommend = () => get('/recommend/resource')

/* 获取歌单收藏者 */
export const getSuberList = ({ id, limit = 30, offset }) => get('/playlist/subscribers', { id, limit, offset })