import get from '@/plugins/get'

/* 获取专辑内容 */
export const getAlbumDetail = (id) => get('/album', { id })

/* 获取专辑动态内容，评论收藏等 */
export const getAlbumDynamic = (id) => get('/album/detail/dynamic', { id, timestamp: Date.now() })