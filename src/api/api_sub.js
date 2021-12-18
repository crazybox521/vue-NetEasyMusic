import get from '@/service/get'
/* 收藏的歌手 */
export const getSubArtists = () => get('/artist/sublist',{timestamp:Date.now()})

/* 收藏的专栏 */
export const getSubColumn = (offset, limit) => get('/topic/sublist', { offset, limit })

/* 收藏的MV列表 */
export const getSubMv = () => get('/mv/sublist',{timestamp:Date.now()})

/* 收藏的专辑列表  */
export const getSubAlbum = (offset = 0, limit = 25) => get('/album/sublist', { offset, limit,timestamp:Date.now() })

/* 收藏/取消收藏歌单 t : 类型,1:收藏,2:取消收藏 */
export const setPlaylistSub = (id, t) => get('/playlist/subscribe', { id, t,timestamp:Date.now() })

/* 收藏/取消收藏专辑 t : 类型,1:收藏,2:取消收藏 */
export const setAlbumSub = (id, t) => get('/album/sub', { id, t ,timestamp:Date.now()})