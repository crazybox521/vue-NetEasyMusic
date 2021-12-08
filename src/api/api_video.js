import get from '@/service/get'

/* 视频分类 */
export const getVideoAlltag = () => get('/video/group/list')

/* 视频热门分类 */
export const getVideoHotTag = () => get('/video/category/list')

/* 全部视频列表 */
export const getAllVideo = (offset) => get('/video/timeline/all', { offset })

/* 根据标签获取视频列表 */
export const getVideoByTag = (id, offset) => get('/video/group', { id, offset })

/* 获取视频详情 */
export const getVideoDetail = (id) => get('/video/detail', { id })

/* 获取相关视频 */
export const getRelatedVideo = (id) => get('/related/allvideo', { id })

/* 获取视频点赞评论数据 */
export const getVideoLike = (vid) => get('/video/detail/info', { vid })

/* 获取视频URL */
export const getVideoUrl = (id) => get('/video/url', { id })

/* 获取全部MV area limit offset order*/
export const getAllMv = ({ area, limit, offset, order }) => get('/mv/all', { area, limit, offset, order })

/* 获取最新MV */
export const getNewMv = (area, limit) => get('/mv/first', { area, limit })

/* 获取网易出品Mv */
export const getNetEasyMv = (limit, offset) => get('/mv/exclusive/rcmd', { limit, offset })

/* mv 排行 area, limit,offset */
export const getTopMv = ({ area, limit, offset=0 }) => get('/top/mv', { area, limit, offset })

/* MV详情 */
export const getMvDetail = (mvid) => get('/mv/detail', { mvid })

/* mv点赞评论数据 */
export const getMvInfo = (mvid) => get('/mv/detail/info', { mvid })

/* 获取推荐MV */
export const getPersonalizedMv = () => get('/personalized/mv')

/* 获取MV地址 */
export const getMvUrl = (id) => get('/mv/url', { id })