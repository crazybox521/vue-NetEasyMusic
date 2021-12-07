import get from '@/service/get'

/* 手机号密码登录 */
export const doLogin = (phone, md5_password) => get('/login/cellphone', { phone, md5_password })

/* 退出登录 */
export const logout = () => get('/logout')

/* 获取登录状态 */
export const getLoginStatus = () => get('/login/status')

/* 获取账号信息 */
export const getAcount = () => get('/user/account', { timestamp: Date.now() })

/* 获取用户详情 */
export const getUserDetail = (uid) => get('/user/detail', { uid })

/* 获取用户歌单 */
export const getUserPlayList = (uid, offset, limit) => get('/user/playlist', { uid, offset, limit })