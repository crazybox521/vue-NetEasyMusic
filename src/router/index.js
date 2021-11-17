import Vue from "vue"
import VueRouter from "vue-router"
import Layout from "../views/Layout.vue"
import Login from "../views/Login.vue"
import NotFound from "../views/NotFound.vue"
import HomePage from "../views/home/HomePage.vue"
import LikeList from "../views/user/LikeList.vue"
import RecommendSong from "../views/user/RecommendSong.vue"
import Friends from "../views/user/Friends.vue"
import HistoryPlay from "../views/historyplay/HistoryPlay.vue"
import SearchList from "../views/search/SearchList.vue"
import PlayListDetail from "../views/playlist/PlayListDetail.vue"
import PersonalRecom from "../views/home/homepageview/PersonalRecom.vue"
import TopList from '../views/home/homepageview/TopList.vue'
import PlayList from '../views/home/homepageview/PlayList.vue'
import ArtistList from '../views/home/homepageview/ArtistList.vue'
import ArtistDetail from '../views/artist/ArtistDetail.vue'
import AlbumDetail from '../views/album/AlbumDetail.vue'
import VideoDetail from '../views/video/VideoDetail.vue'
import VideoView from '../views/videoview/VideoView.vue'
import Video from '../views/videoview/Video.vue'
import MusicVideo from '../views/videoview/MusicVideo.vue'
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
            {
                path: 'videoview',
                component: VideoView,
                redirect: '/video',
                children: [
                    { path: '/video', component: Video },
                    { path: '/mv', component: MusicVideo }
                ]
            },

            { path: "search/:key", component: SearchList, },// 搜索展示页
            { path: "playlistdetail/:id", component: PlayListDetail, },//歌单详情页
            { path: "artistdetail/:id", component: ArtistDetail, },//歌手详情页
            { path: "albumdetail/:id", component: AlbumDetail, },//专辑详情页
            { path: "videodetail/:id", component: VideoDetail, },//专辑详情页
            { path: "like", component: LikeList, },//喜欢的歌曲
            { path: 'recomsongs', component: RecommendSong },//每日推荐歌曲页
            { path: 'historyplay', component: HistoryPlay },//最近播放页
            { path: 'friends', component: Friends },//朋友页
        ],
    },
    { path: '/login', component: Login },
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