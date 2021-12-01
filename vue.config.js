
const path = require("path");
const resolve = dir => path.join(__dirname, dir);

module.exports = {
    baseUrl: "./",
    runtimeCompiler: true,
    devServer: {
        proxy: 'http://localhost:3000'
    },
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src"));
        config.when(process.env.NODE_ENV === 'production', config => {
            /* 设置打包入口 */
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                nprogress: 'NProgress',
                vuex: 'Vuex',
                'js-md5': 'md5'
            })

            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = true
                return args
            })
        })
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main.js')
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = false
                return args
            })
        })
    }
}