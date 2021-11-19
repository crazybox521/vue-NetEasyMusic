import Vue from "vue"
import VueRouter from "vue-router"
/* 路由懒加载 */
/* 首屏 */
const Layout = () => import( /* webpackChunkName: "group-home" */ '../views/Layout.vue')
const HomePage = () => import( /* webpackChunkName: "group-home" */ '../views/home/HomePage.vue')
const PersonalRecom = () => import( /* webpackChunkName: "group-home" */ '../views/home/homepageview/PersonalRecom.vue')
/* 登录 和 404*/
const Login = () => import( /* webpackChunkName: "group-login" */ '../views/Login.vue')
const NotFound = () => import( /* webpackChunkName: "group-login" */ '../views/NotFound.vue')
/* 发现页其他 */
const TopList = () => import( /* webpackChunkName: "group-homepage" */ '../views/home/homepageview/TopList.vue')
const PlayList = () => import( /* webpackChunkName: "group-homepage" */ '../views/home/homepageview/PlayList.vue')
const ArtistList = () => import( /* webpackChunkName: "group-homepage" */ '../views/home/homepageview/ArtistList.vue')
/* 需登录后才能进入的页面 */
const LikeList = () => import( /* webpackChunkName: "group-user" */ '../views/user/LikeList.vue')
const RecommendSong = () => import( /* webpackChunkName: "group-user" */ '../views/user/RecommendSong.vue')
const Friends = () => import( /* webpackChunkName: "group-user" */ '../views/user/Friends.vue')
const SubScribeView = () => import( /* webpackChunkName: "group-user" */ '../views/user/subscribe/SubScribeView.vue')
/* 历史播放 */
const HistoryPlay = () => import( /* webpackChunkName: "group-hisplay" */ '../views/historyplay/HistoryPlay.vue')
/* 搜索相关 */
const SearchList = () => import( /* webpackChunkName: "group-search" */ '../views/search/SearchList.vue')
/* 各大详情页 */
const PlayListDetail = () => import( /* webpackChunkName: "group-detail" */ '../views/playlist/PlayListDetail.vue')
const ArtistDetail = () => import( /* webpackChunkName: "group-detail" */ '../views/artist/ArtistDetail.vue')
const AlbumDetail = () => import( /* webpackChunkName: "group-detail" */ '../views/album/AlbumDetail.vue')
const VideoDetail = () => import( /* webpackChunkName: "group-detail" */ '../views/video/VideoDetail.vue')
const MvDetail = () => import( /* webpackChunkName: "group-detail" */ '../views/video/MvDetail.vue')
/* 视频页首屏 */
const VideoView = () => import( /* webpackChunkName: "group-video" */ '../views/videoview/VideoView.vue')
const Video = () => import( /* webpackChunkName: "group-video" */ '../views/videoview/Video.vue')
const MusicVideo = () => import( /* webpackChunkName: "group-video" */ '../views/videoview/mv/MusicVideo.vue')
const AllMv = () => import( /* webpackChunkName: "group-video" */ '../views/videoview/mv/AllMv.vue')
const TopMv = () => import( /* webpackChunkName: "group-video" */ '../views/videoview/mv/TopMv.vue')
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
            /* 视频列表页 */
            {
                path: 'videoview',
                component: VideoView,
                redirect: '/video',
                children: [
                    { path: '/video', component: Video },//video的首屏
                    { path: '/mv', component: MusicVideo }//mv的首屏
                ]
            },
            /* 收藏页 */
            {
                path: 'subscribe',
                component: SubScribeView,

            },
            { path: "search/:key", component: SearchList, },// 搜索展示页
            { path: "playlistdetail/:id", component: PlayListDetail, },//歌单详情页
            { path: "artistdetail/:id", component: ArtistDetail, },//歌手详情页
            { path: "albumdetail/:id", component: AlbumDetail, },//专辑详情页
            { path: "videodetail/:id", component: VideoDetail, },//视频详情页
            { path: "mvdetail/:id", component: MvDetail, },//mv详情页
            { path: "like", component: LikeList, },//喜欢的歌曲
            { path: 'recomsongs', component: RecommendSong },//每日推荐歌曲页
            { path: 'historyplay', component: HistoryPlay },//最近播放页
            { path: 'friends', component: Friends },//朋友页
            { path: 'allmv', component: AllMv },//全部MV页
            { path: 'topmv', component: TopMv },//MV排行页
        ],
    },
    { path: '/login', component: Login },//login
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