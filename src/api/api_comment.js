import get from '@/plugins/get'
/* type: 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态 */
/* 获取热门评论 */
export const getHotComment = (id, type, limit, offset, before) => get('/comment/hot', { id, type, limit, offset, before, timestamp: Date.now() })

/* 获取歌单评论 */
export const getPlayListComment = ({ id, limit, offset, before }) => get('/comment/playlist', { id, limit, offset, before, timestamp: Date.now() })

/* 发送删除评论 */
export const sendComment = ({ t, type, id, content, commentId }) => get('/comment', { t, type, id, content, commentId })

/* 给评论点赞 */
export const likeComment = ({ id, cid, t, type }) => get('/comment/like', { id, cid, t, type })
