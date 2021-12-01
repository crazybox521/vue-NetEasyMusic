import axios from "axios";
import NProgress from 'nprogress'
import Vue from 'vue'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 8000

axios.interceptors.request.use((config) => {
    NProgress.start();
    return config
})

axios.interceptors.response.use((config) => {
    NProgress.done();
    return config
})

export default (url, params) => axios.get(url, { params })

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

        })
        .catch((err) => {
            console.log(err);
            console.log("下载失败,请稍后重试!");
            Vue.prototype.$message.error('下载失败,请稍后重试!')
        });

}