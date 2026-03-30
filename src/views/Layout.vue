<script setup>
import Sidebar from "@/components/Sidebar.vue";
import { useUserStore} from "@/store/user";
import { useRouter } from "vue-router";
import {onMounted, ref} from "vue";
import request from "@/utils/request.js";

const userStore = useUserStore();
const router = useRouter();
const currentTime = ref('');

// 更新时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long'
  });
};

//登出
const logout = () =>{
  userStore.logout();
  router.push("/login");
}

onMounted(() =>{
  if (userStore.token) {
    request.get('api/users')
  }
  updateTime();
  setInterval(updateTime, 1000);
})
</script>


<template>
  <el-container class="layout-container">
    <Sidebar />

    <el-container class="main-container">
      <el-header class="main-header">
        <div class="header-left">
          <h1 class="header-title">Play Admin</h1>
          <span class="header-subtitle">后台管理系统</span>
        </div>

        <div class="header-right">
          <span class="header-time">{{ currentTime }}</span>

          <el-dropdown trigger="click">
            <div class="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>管理员</span>
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 8px;">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 8px;">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  background: #f0f2f5;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.main-header {
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.header-subtitle {
  font-size: 13px;
  color: #9ca3af;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-time {
  font-size: 13px;
  color: #6b7280;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  background: #f1f5f9;
}

.user-avatar svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.user-avatar .arrow {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.user-avatar span {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.main-content {
  padding: 24px;
  background: #f0f2f5;
  overflow-y: auto;
}

/* 美化下拉菜单 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f0f2ff;
  color: #667eea;
}
</style>
