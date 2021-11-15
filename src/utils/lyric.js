/* 歌词提取 */
export default class Lyric {
    static formatLyricTime(time) { // 格式化歌词的时间 转换成 sss:ms
        const regMin = /.*:/
        const regSec = /:.*\./
        const regMs = /\./

        const min = parseInt(time.match(regMin)[0].slice(0, 2))
        let sec = parseInt(time.match(regSec)[0].slice(1, 3))
        const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
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
        this.lines = lines
        this.total = lines.length
        this.curren = 0
    }
}