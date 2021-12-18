import axios from "axios";
import NProgress from 'nprogress'
import Vue from 'vue'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 8000
axios.defaults.baseURL = 'http://localhost:8080/'

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