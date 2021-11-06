import Vue from "vue";
import VueRouter from "vue-router";
import Home from '../views/home/Home.vue'
import SongList from '../views/search/SongsList.vue'
Vue.use(VueRouter)
const routes =[
    {
        path:'/',
        component:Home,
        children:[
            {
                path:'songlist',
                component:SongList
            }
        ]
    }
]

const router = new VueRouter({
    mode:'hash',
    routes
})

router.beforeEach((to,from,next) => {
    next()
})

export default router