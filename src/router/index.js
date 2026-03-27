import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import {useUserStore} from "@/store/user";
import UserView from "@/views/UserView.vue";
import SettingsView from '@/views/SettingsView.vue'

const routes = [
    {
        path: '/login',
        component: LoginView
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                component: HomeView
            },
            {
                path: 'users',
                component: UserView
            },
            {
                path: 'settings',
                component: SettingsView
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (!userStore.token && to.path !== '/login') {
        return next('/login')
    } else {
        next()
    }
})

export default router