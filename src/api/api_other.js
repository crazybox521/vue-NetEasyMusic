import get from '@/plugins/get'

/* 检索歌曲等 */
export const search = ({ limit, offset, type, keywords }) => get('/cloudsearch', { limit, offset, type, keywords })

/* 获取轮播图 */
export const getBanner = () => get('/banner')







