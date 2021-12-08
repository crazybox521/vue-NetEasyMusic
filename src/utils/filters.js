import Vue from "vue";
/* 歌曲时长的过滤器 */
Vue.filter('timeFormat', function (time) {
    if (typeof time === 'undefined') return 0
    let minutes = parseInt(time / 60); // 获取时长分钟
    let seconds = parseInt(time % 60); // 获取时长秒数
    seconds = seconds < 10 ? '0' + seconds : seconds // 秒
    minutes = minutes < 10 ? '0' + minutes : minutes
    return minutes + ':' + seconds
})

/* 时间的过滤器 */
Vue.filter('dateFormat', function (time) {
    if (typeof time === 'undefined') return 0
    const t = new Date(time)
    let year = t.getFullYear()
    let mouth = t.getMonth() + 1
    let day = t.getDay()
    mouth = mouth < 10 ? '0' + mouth : mouth
    day = day < 10 ? '0' + day : day
    return year + '-' + mouth + '-' + day
})
/* 播放数量的过滤器 */
Vue.filter('countFormat', function (count) {
    if (typeof count === 'undefined') return 0
    if (count < 10000) return count
    else return Math.floor(count / 10000) + '万'
})
Vue.filter('mvTopFormat', function (index) {
    if (typeof index === 'undefined') return
    return index < 10 ? '0' + index : index
})