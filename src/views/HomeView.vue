<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([
  { title: '总用户数', value: '1,234', icon: 'users', color: '#667eea', trend: '+12%' },
  { title: '今日访问', value: '856', icon: 'eye', color: '#10b981', trend: '+8%' },
  { title: '新增订单', value: '128', icon: 'shopping', color: '#f59e0b', trend: '+23%' },
  { title: '系统消息', value: '32', icon: 'bell', color: '#ef4444', trend: '-5%' }
])

const currentHour = ref(new Date().getHours())
const greeting = ref('')

onMounted(() => {
  if (currentHour.value < 12) {
    greeting.value = '早上好'
  } else if (currentHour.value < 18) {
    greeting.value = '下午好'
  } else {
    greeting.value = '晚上好'
  }
})
</script>

<template>
<div class="home-view">
  <!-- 欢迎区域 -->
  <div class="welcome-section">
    <div class="welcome-content">
      <h1>{{ greeting }}，管理员 👋</h1>
      <p>欢迎回到 Play Admin 管理系统，祝您工作愉快！</p>
    </div>
    <div class="welcome-illustration">
      <svg viewBox="0 0 200 150" fill="none">
        <rect x="20" y="40" width="160" height="90" rx="8" fill="#e0e7ff"/>
        <rect x="30" y="50" width="60" height="40" rx="4" fill="#667eea"/>
        <rect x="100" y="50" width="70" height="18" rx="4" fill="#a5b4fc"/>
        <rect x="100" y="72" width="50" height="18" rx="4" fill="#c7d2fe"/>
        <circle cx="60" cy="110" r="15" fill="#667eea"/>
        <rect x="85" y="100" width="85" height="8" rx="4" fill="#a5b4fc"/>
        <rect x="85" y="112" width="60" height="8" rx="4" fill="#c7d2fe"/>
      </svg>
    </div>
  </div>

  <!-- 统计卡片 -->
  <div class="stats-grid">
    <div v-for="(stat, index) in stats" :key="index" class="stat-card">
      <div class="stat-icon" :style="{ background: stat.color + '15', color: stat.color }">
        <!-- 用户图标 -->
        <svg v-if="stat.icon === 'users'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <!-- 眼睛图标 -->
        <svg v-if="stat.icon === 'eye'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <!-- 购物图标 -->
        <svg v-if="stat.icon === 'shopping'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <!-- 铃铛图标 -->
        <svg v-if="stat.icon === 'bell'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <div class="stat-info">
        <p class="stat-title">{{ stat.title }}</p>
        <h3 class="stat-value">{{ stat.value }}</h3>
      </div>
      <div class="stat-trend" :class="{ positive: stat.trend.startsWith('+'), negative: stat.trend.startsWith('-') }">
        {{ stat.trend }}
      </div>
    </div>
  </div>

  <!-- 快捷操作 -->
  <div class="quick-actions">
    <h2 class="section-title">快捷操作</h2>
    <div class="actions-grid">
      <div class="action-card" @click="$router.push('/users')">
        <div class="action-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <span>添加用户</span>
      </div>
      <div class="action-card" @click="$router.push('/settings')">
        <div class="action-icon" style="background: linear-gradient(135deg, #10b981, #34d399)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <span>系统设置</span>
      </div>
      <div class="action-card">
        <div class="action-icon" style="background: linear-gradient(135deg, #f59e0b, #fbbf24)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <span>查看报表</span>
      </div>
      <div class="action-card">
        <div class="action-icon" style="background: linear-gradient(135deg, #ef4444, #f87171)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <span>帮助中心</span>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.home-view {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.welcome-content h1 {
  font-size: 28px;
  color: white;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.welcome-content p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.welcome-illustration svg {
  width: 180px;
  height: auto;
  opacity: 0.9;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 26px;
  height: 26px;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.stat-trend {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.stat-trend.positive {
  background: #d1fae5;
  color: #059669;
}

.stat-trend.negative {
  background: #fee2e2;
  color: #dc2626;
}

/* 快捷操作 */
.quick-actions {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.action-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.action-card span {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }

  .welcome-illustration {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>