import get from '@/plugins/get'

/* 检索歌曲等 */
export const search = ({ limit, offset, type, keywords }) => get('/cloudsearch', { limit, offset, type, keywords })

export const getHotSearch =()=>get('/search/hot/detail')

/* 获取轮播图 */
export const getBanner = () => get('/banner')







