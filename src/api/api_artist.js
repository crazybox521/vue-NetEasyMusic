import get from '@/plugins/get'
/* 获取歌手列表 */
export const getArtistList = ({ limit, offset, type, area, initial }) => get('/artist/list', { limit, offset, type, area, initial })

/* 获取歌手详情 */
export const queryArtistDetail = (id) => get('/artist/detail', { id })

/* 获取歌手热门50首 */
export const getArtistTop = (id) => get('/artist/top/song', { id })

/* 获取歌手专辑 */
export const getArtistAlbum = (id, limit = 50, offset = 0) => get('/artist/album', { id, limit, offset })

/* 获取歌手MV */
export const getArtistMv = (id) => get('/artist/mv', { id })

/* 获取相似歌手 */
export const getArtistSame = (id) => get('/simi/artist', { id })

/* 获取歌手描述 */
export const getIntro = (id) => get('/artist/desc', { id })