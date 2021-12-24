import axios from "axios";
import NProgress from 'nprogress'
import Vue from 'vue'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 10000
/* axios.defaults.baseURL = 'http://localhost:8080/' */

axios.interceptors.request.use((config) => {
    NProgress.start();
    return config
})

axios.interceptors.response.use((config) => {
    NProgress.done();
    return config
})

export default (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then((res) => {
            resolve(res.data)
        }).catch((err) => {
            reject(err)
        });

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
export const uploadPlayListImg = ({ id, imgSize, data, imgX = 0, imgY = 0 }) => {
    return axios({
        method: 'post',
        url: `/playlist/cover/update?id=${id}&imgSize=${imgSize}&imgX=${imgX}&imgY=${imgY}&timestamp=${Date.now()}`,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data,
    }).then((res) =>res.data)
}