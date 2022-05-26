import axios from "axios";
import Vue from 'vue'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 10000
axios.defaults.baseURL = "http://47.102.159.133/"
import store from "@/store";
/* 项目大部分为get请求，封装一个统一的处理错误、传递参数和url的get方法 */
export default (url, params) => {
    if (!params) params = {}
    if (store.state.ip)
        params.realIP = store.state.ip
    return axios.get(url, { params })
        .then(res => res.data)
        .catch(err => {
            console.warn(err.response.statusText)
            /* 返回后端返回的错误信息，如果有的话 */
            return err.response.data
        })
}

/* 下载 */
export const downloadMusic = (url, fileName) => {
    axios
        .get(
            url, {
            responseType: "blob"
        })
        .then((res) => {
            let blob = res.data;
            let href = URL.createObjectURL(blob);
            console.log(href);
            let a = document.createElement("a");
            a.href = href;
            a.download = fileName
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            Vue.prototype.$message.success(`${fileName}下载成功`)
        })
        .catch((err) => {
            console.log(err);
            Vue.prototype.$message.$message.error('下载失败,请稍后重试!')
        });

}
/* 上传歌单图片 */
export const uploadPlayListImg = ({ id, imgSize, data, imgX = 0, imgY = 0 }) =>
    axios({
        method: 'post',
        url: `/playlist/cover/update?id=${id}&imgSize=${imgSize}&imgX=${imgX}&imgY=${imgY}&timestamp=${Date.now()}`,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data,
    }).then((res) => res.data).catch(err => err)

/* 更新用户头像 */
export const uploadAvatar = ({ imgSize, data, imgX = 0, imgY = 0 }) => axios({
    method: 'post',
    url: `/avatar/upload?&imgSize=${imgSize}&imgX=${imgX}&imgY=${imgY}&timestamp=${Date.now()}`,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    data,
}).then((res) => res.data).catch(err => err)

export const getIp = () => axios.get('http://47.102.159.133:3333/real')