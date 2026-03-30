<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'
import LoginMascot from '@/components/LoginMascot.vue'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: ''
})

// 密码框是否聚焦
const isPasswordFocus = ref(false)

// 登录状态：'' | 'error' | 'success'
const loginStatus = ref('')

const handleLogin = async () => {
  try {
    const res = await request.post('/api/login', form)
    console.log('login success response:', res.data)

    const token = res.data.data.token
    userStore.setToken(token)

    loginStatus.value = 'success'

    setTimeout(() => {
      router.push('/')
    }, 600)
  } catch (error) {
    console.log('error logged in', error)
    console.log('response data:', error.response?.data)
    loginStatus.value = 'error'

    setTimeout(() => {
      loginStatus.value = ''
    }, 1500)

    alert(error.response?.data?.message || '登录失败')
  }
}
</script>


<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-card">
      <!-- 左侧动画角色 -->
      <div class="login-left">
        <div class="welcome-text">
          <h1>欢迎回来</h1>
          <p>登录以继续访问管理系统</p>
        </div>
        <LoginMascot
            :is-password-focus="isPasswordFocus"
            :login-status="loginStatus"
        />
      </div>

      <!-- 右侧登录区域 -->
      <div class="login-right">
        <div class="login-header">
          <h2>系统登录</h2>
          <p class="subtitle">Play Admin System</p>
        </div>

        <el-form class="login-form" :model="form">
          <el-form-item>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <el-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  size="large"
                  clearable
              />
            </div>
          </el-form-item>

          <el-form-item>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  size="large"
                  show-password
                  @focus="isPasswordFocus = true"
                  @blur="isPasswordFocus = false"
                  @keyup.enter="handleLogin"
              />
            </div>
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="handleLogin"
            :loading="loginStatus === 'loading'"
          >
            {{ loginStatus === 'loading' ? '登录中...' : '立即登录' }}
          </el-button>

          <div class="login-footer">
            <p class="tip">💡 提示：演示账号 admin / 123456</p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>



<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰圆形 */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 30%;
  right: -50px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.login-card {
  width: 920px;
  min-height: 520px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
  animation: cardAppear 0.6s ease-out;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-left {
  width: 45%;
  background: linear-gradient(145deg, #f0e6ff 0%, #e0d4ff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
}

.login-left::after {
  content: '';
  position: absolute;
  right: 0;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(102, 126, 234, 0.2), transparent);
}

.welcome-text {
  text-align: center;
  margin-bottom: 20px;
}

.welcome-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #4c3d8f;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.welcome-text p {
  font-size: 14px;
  color: #7c6bb8;
}

.login-right {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  margin-bottom: 40px;
}

.login-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.login-header .subtitle {
  font-size: 14px;
  color: #9ca3af;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-form {
  width: 100%;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  z-index: 10;
  pointer-events: none;
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: #667eea;
}

.login-form :deep(.el-input__wrapper) {
  padding: 0 16px 0 48px;
  height: 52px;
  border-radius: 12px;
  background: #f8fafc;
  box-shadow: none !important;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  background: #f1f5f9;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
}

.login-form :deep(.el-input__inner) {
  font-size: 15px;
  color: #1e293b;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #94a3b8;
}

.login-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.login-btn:active {
  transform: translateY(0);
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer .tip {
  font-size: 13px;
  color: #9ca3af;
  background: #f8fafc;
  padding: 12px 20px;
  border-radius: 8px;
  display: inline-block;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    width: 100%;
    max-width: 420px;
    min-height: auto;
  }

  .login-left {
    width: 100%;
    padding: 30px;
  }

  .login-left::after {
    display: none;
  }

  .welcome-text h1 {
    font-size: 22px;
  }

  .login-right {
    padding: 40px 30px;
  }

  .login-header h2 {
    font-size: 26px;
  }
}
</style>