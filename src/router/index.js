import Vue from "vue"
import VueRouter from "vue-router"
import Layout from "../views/Layout.vue"
import HomePage from "../views/home/HomePage.vue"
import SearchList from "../views/search/SearchList.vue"
import PlayListDetail from "../views/playlist/PlayListDetail.vue"
import PersonalRecom from "../views/home/homepageview/PersonalRecom.vue"
import TopList from '../views/home/homepageview/TopList.vue'
import PlayList from '../views/home/homepageview/PlayList.vue'
import ArtistList from '../views/home/homepageview/ArtistList.vue'
Vue.use(VueRouter);
const routes = [
    {
        path: "/",
        component: Layout,
        redirect:'homepage',
        children: [{
            path: "search",
            component: SearchList,
        },
        /* 发现音乐页 */
        {
            path: "homepage",
            component: HomePage,
            redirect: "/homepage/personalrecom",
            children: [
                {
                    path: "personalrecom",
                    component: PersonalRecom,
                }, {
                    path: 'toplist',
                    component: TopList
                },{
                    path:'playlist',
                    component:PlayList
                },{
                    path:'artistlist',
                    component:ArtistList
                }
            ],
        },
        {
            path: "playlistdetail/:id",
            component: PlayListDetail,
        },
        ],
    },]

const router = new VueRouter({
    mode: "hash",
    routes,
})

router.beforeEach((to, from, next) => {
    document.title='网易云音乐客户端PC版'
    next()
})

export default router