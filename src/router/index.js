import Vue from "vue";
import VueRouter from "vue-router";
import Layout from '../views/home/Layout.vue'
import HomePage from '../views/home/HomePage.vue'
import SongList from '../views/search/SongsList.vue'
Vue.use(VueRouter)
const routes =[
    {
        path:'/',
        component:Layout,
        children:[
            {
                path:'songlist',
                component:SongList
            },{
                path:'homepage',
                component:HomePage
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