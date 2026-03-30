import router from './router';

import { createPinia } from "pinia";
import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入全局样式
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)


app.use(router)
app.use(ElementPlus)
app.mount('#app')