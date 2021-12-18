import get from '@/service/get'

/* 视频分类 */
export const getVideoAlltag = () => get('/video/group/list')

/* 视频热门分类 */
export const getVideoHotTag = () => get('/video/category/list')

/* 全部视频列表 */
export const getAllVideo = (offset) => get('/video/timeline/all', { offset })

/* 根据标签获取视频列表 */
export const getVideoByTag = (id, offset) => get('/video/group', { id, offset })

/* 获取全部MV area limit offset order*/
export const getAllMv = ({ area, limit, offset, order }) => get('/mv/all', { area, limit, offset, order })

/* 获取最新MV */
export const getNewMv = (area, limit) => get('/mv/first', { area, limit })

/* 获取网易出品Mv */
export const getNetEasyMv = (limit, offset) => get('/mv/exclusive/rcmd', { limit, offset })

/* mv 排行 area, limit,offset */
export const getTopMv = ({ area, limit, offset = 0 }) => get('/top/mv', { area, limit, offset })

//type:资源类型,mv/v
/* 获取视频/mv详情 */
export const getVideoDetail = (type, id) => {
    if (type === 'v') {
        return get('/video/detail', { id, timestamp: Date.now() })
    } else if (type === 'mv') {
        return get('/mv/detail', { mvid: id, timestamp: Date.now() })
    } else {
        return { code: 404 }
    }
}

/* 获取相关视频/mv */
export const getRelatedVideo = (type, id) => {
    if (type === 'v') {
        return get('/related/allvideo', { id })
    } else if (type === 'mv') {
        return get('/personalized/mv')
    } else {
        return { code: 404 }
    }
}
/* 获取视频/mv URL */
export const getVideoUrl = (type, id) => {
    if (type === 'v') {
        return get('/video/url', { id })
    } else if (type === 'mv') {
        return get('/mv/url', { id })
    } else {
        return { code: 404 }
    }
}
/* 获取视频/mv点赞评论数据 */
export const getVideoLike = (type, id) => {
    if (type === 'v') {
        return get('/video/detail/info', { vid: id, timestamp: Date.now() })
    } else if (type === 'mv') {
        return get('/mv/detail/info', { mvid: id, timestamp: Date.now() })
    } else {
        return { code: 404 }
    }
}
/* 收藏视频/MV */
export const subVideo = ({ type, t, id }) => {
    if (type === 'v') {
        return get('/video/sub', { t, id, timestamp: Date.now() })
    } else if (type === 'mv') {
        return get('/mv/sub', { mvid: id, t, timestamp: Date.now() })
    } else {
        return { code: 404 }
    }

}


/* 给资源点赞 */
//type:资源类型,对应以下类型 1: mv 4: 电台 5: 视频 6: 动态
//t 操作,1 为点赞,其他未取消点赞
export const likeVideo = ({ type, t = 1, id }) => get('/resource/like', { type, t, id,timestamp:Date.now()})

