import Vue from 'vue'
import Router from 'vue-router'

//路由懒加载
const home = () => import("@/components/Home");
const dashboard = () => import("@/views/dashboard/index"); 

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: dashboard
            },
        ]
    },
    {
        path: '*',
        redirect: '/'
    }
  ]
})
const originalPush = Router.prototype.push
	Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
