import get from '@/service/get'

/* 检索歌曲等 */
export const search = ({ limit, offset, type, keywords }) => get('/cloudsearch', { limit, offset, type, keywords })

/* 热搜 */
export const getHotSearch = () => get('/search/hot/detail')

/* 搜索建议 */
export const getSuggest = ({ type, keywords }) => get('/search/suggest', { type, keywords })

/* 获取轮播图 */
export const getBanner = () => get('/banner')







