import Vue from "vue";
import VueRouter from "vue-router";
import Layout from '../views/home/Layout.vue'
import HomePage from '../views/home/HomePage.vue'
import SearchList from '../views/search/SearchList.vue'
import PlayListDetail from '../views/playlist/PlayListDetail.vue'
Vue.use(VueRouter)
const routes =[
    {
        path:'/',
        component:Layout,
        children:[
            {
                path:'search',
                component:SearchList
            },{
                path:'homepage',
                component:HomePage
            },{
                path:'playlistdetail/:id',
                component:PlayListDetail
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