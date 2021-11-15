/* 歌词提取 */
export default class Lyric {
    static formatLyricTime(time) { // 格式化歌词的时间 转换成 sss:ms
        const regMin = /.*:/
        const regSec = /:.*\./
        const regMs = /\./
        let min, sec, ms
        /* 歌词的格式有些有问题 */
        try {
            min = parseInt(time.match(regMin)[0].slice(0, 2))
            /* 这里有个BUG 歌词时间格式不对的话 */
            sec = parseInt(time.match(regSec)[0].slice(1, 3))
            ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
        } catch (error) {
            console.log('出错啦');
        }

        if (min !== 0) {
            sec += min * 60
        }
        return Number(sec + '.' + ms)
    }
    constructor(str) {
        let arr = str.split('\n')
        let lines = []
        console.log(arr);
        const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
        try {
            arr.forEach(item => {
                if (item === '') return
                const obj = {}
                const time = item.match(regTime)
                obj.txt = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
                obj.time = time ? Lyric.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
                if (obj.txt === '') {
                    console.log('这一行没有歌词');
                } else {
                    lines.push(obj)
                }
            })
        } catch (error) {
            this.lines = [{time:1,txt:'解析歌词失败'}]
            this.total = 1
            this.curren = 0
            this.errorLyric = true
            return this
        }

        this.lines = lines
        this.total = lines.length
        this.curren = 0
    }
}