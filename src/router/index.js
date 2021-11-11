import Vue from "vue"
import VueRouter from "vue-router"
import Layout from "../views/Layout.vue"
import NotFound from "../views/NotFound.vue"
import HomePage from "../views/home/HomePage.vue"
import SearchList from "../views/search/SearchList.vue"
import PlayListDetail from "../views/playlist/PlayListDetail.vue"
import PersonalRecom from "../views/home/homepageview/PersonalRecom.vue"
import TopList from '../views/home/homepageview/TopList.vue'
import PlayList from '../views/home/homepageview/PlayList.vue'
import ArtistList from '../views/home/homepageview/ArtistList.vue'
import ArtistDetail from '../views/artist/ArtistDetail.vue'
Vue.use(VueRouter);
const routes = [
    {
        path: "/",
        component: Layout,
        redirect: 'homepage',
        children: [
            /* 发现音乐页 */
            {
                path: "homepage",
                component: HomePage,
                redirect: "/personalrecom",
                children: [
                    { path: "/personalrecom", component: PersonalRecom, },//个性推荐
                    { path: '/toplist', component: TopList },//排行榜
                    { path: '/playlist', component: PlayList },//歌单列表页
                    { path: '/artistlist', component: ArtistList }//歌手页
                ],
            },
           
            { path: "search/:key", component: SearchList, },// 搜索展示页
            { path: "playlistdetail/:id", component: PlayListDetail, },//歌单详情页
            { path: "artistdetail/:id", component: ArtistDetail, },//歌单详情页
        ],
    },
    { path: '*', component: NotFound }//404
]

const router = new VueRouter({
    mode: "hash",
    routes,
})

router.beforeEach((to, from, next) => {
    document.title = '网易云音乐客户端PC版'
    next()
})

export default router