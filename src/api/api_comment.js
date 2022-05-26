import get from '@/service/get'
/* type: 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态 */
/* 获取热门评论 */
export const getHotComment = (id, type, limit, offset, before) => get('/comment/hot', { id, type, limit, offset, before, timestamp: Date.now() })

/* login 发送删除评论 */
export const sendComment = ({ t, type, id, content, commentId }) => get('/comment', { t, type, id, content, commentId, timestamp: Date.now() })

/* login 给评论点赞 */
export const likeComment = ({ id, cid, t, type }) => get('/comment/like', { id, cid, t, type, timestamp: Date.now() })

/* 获取最新评论 */
export const getNewComment = ({ id, limit, offset, before, type }) => {
    switch (type) {
        case 0: return get('/comment/music', { id, limit, offset, before, timestamp: Date.now() })
        case 1: return get('/comment/mv', { id, limit, offset, before, timestamp: Date.now() })
        case 2: return get('/comment/playlist', { id, limit, offset, before, timestamp: Date.now() })
        case 3: return get('/comment/album', { id, limit, offset, before, timestamp: Date.now() })
        case 4: return get('/comment/dj', { id, limit, offset, before, timestamp: Date.now() })
        case 5: return get('/comment/video', { id, limit, offset, before, timestamp: Date.now() })
    }
}
