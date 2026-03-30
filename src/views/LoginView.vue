<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

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

// 鼠标位置
const mousePos = ref({ x: 0, y: 0 })

// 角色容器引用
const charactersRef = ref(null)

// 处理鼠标移动
const handleMouseMove = (e) => {
  if (!charactersRef.value || isPasswordFocus.value) return
  const rect = charactersRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const dx = e.clientX - centerX
  const dy = e.clientY - centerY
  const maxDistance = 300

  const normalizedX = Math.min(Math.max(dx / maxDistance, -1), 1)
  const normalizedY = Math.min(Math.max(dy / maxDistance, -1), 1)

  mousePos.value = { x: normalizedX * 6, y: normalizedY * 6 }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

const handleLogin = async () => {
  try {
    const res = await request.post('/login', form)
    console.log('login success response:', res.data)

    const token = res.data.data.token
    userStore.setToken(token)

    loginStatus.value = 'success'

    setTimeout(() => {
      router.push('/')
    }, 800)
  } catch (error) {
    console.log('error logged in', error)
    console.log('response data:', error.response?.data)
    loginStatus.value = 'error'

    setTimeout(() => {
      loginStatus.value = ''
    }, 1500)
  }
}
</script>


<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧角色区域 -->
      <div class="characters-section" ref="charactersRef">
        <!-- 鼠标光标装饰 -->
        <div class="cursor-decoration">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M4 4L10 20L12 14L18 12L4 4Z" fill="#1a1a2e" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- 角色们 -->
        <div class="characters-group" :class="{
          'hiding': isPasswordFocus,
          'shaking': loginStatus === 'error',
          'happy': loginStatus === 'success'
        }">

          <!-- 橙色圆形角色 (最大，在左下) -->
          <div class="character orange-ball">
            <div class="face" :class="{ 'hidden': isPasswordFocus }">
              <div class="eyes">
                <div class="eye left">
                  <div class="pupil" :style="{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }"></div>
                </div>
                <div class="eye right">
                  <div class="pupil" :style="{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }"></div>
                </div>
              </div>
              <div class="mouth smile" :class="{ 'sad': loginStatus === 'error' }"></div>
            </div>
          </div>

          <!-- 紫色方形角色 (最高) -->
          <div class="character purple-rect">
            <div class="face" :class="{ 'hidden': isPasswordFocus }">
              <div class="eyes">
                <div class="eye left">
                  <div class="pupil" :style="{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }"></div>
                </div>
                <div class="eye right">
                  <div class="pupil" :style="{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }"></div>
                </div>
              </div>
              <div class="mouth flat" :class="{ 'worried': loginStatus === 'error' }"></div>
            </div>
          </div>

          <!-- 黑色方形角色 (中间小的) -->
          <div class="character black-rect">
            <div class="face" :class="{ 'hidden': isPasswordFocus }">
              <div class="eyes">
                <div class="eye left white-eye">
                  <div class="pupil white" :style="{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }"></div>
                </div>
                <div class="eye right white-eye">
                  <div class="pupil white" :style="{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 黄色椭圆角色 -->
          <div class="character yellow-oval">
            <div class="face" :class="{ 'hidden': isPasswordFocus }">
              <div class="eyes">
                <div class="eye left">
                  <div class="pupil" :style="{ transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)` }"></div>
                </div>
                <div class="eye right">
                  <div class="pupil" :style="{ transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)` }"></div>
                </div>
              </div>
              <div class="mouth smile small"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-section">
        <div class="login-card">
          <!-- Logo -->
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="4" width="16" height="24" rx="3" fill="#1a1a2e"/>
              <circle cx="16" cy="13" r="4" fill="#fff"/>
            </svg>
          </div>

          <h1 class="title">Welcome back!</h1>
          <p class="subtitle">Please enter your details</p>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label>用户名</label>
              <input
                type="text"
                v-model="form.username"
                placeholder="请输入用户名"
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label>密码</label>
              <div class="password-input">
                <input
                  type="password"
                  v-model="form.password"
                  placeholder="请输入密码"
                  autocomplete="current-password"
                  @focus="isPasswordFocus = true"
                  @blur="isPasswordFocus = false"
                  @keyup.enter="handleLogin"
                />
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" />
                <span>Remember for 30 days</span>
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" class="login-btn" :disabled="loginStatus === 'loading'">
              Log In
            </button>

            <button type="button" class="google-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Log in with Google
            </button>
          </form>

          <p class="signup-text">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.login-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1100px;
  min-height: 100vh;
  background: #f5f5f5;
}

/* 左侧角色区域 */
.characters-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.cursor-decoration {
  position: absolute;
  top: 100px;
  left: 80px;
  animation: cursorFloat 3s ease-in-out infinite;
}

@keyframes cursorFloat {
  0%, 100% { transform: translate(0, 0) rotate(-5deg); }
  50% { transform: translate(15px, -15px) rotate(5deg); }
}

.characters-group {
  position: relative;
  width: 320px;
  height: 280px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 角色基础样式 */
.character {
  position: absolute;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.character .face {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.character .face.hidden {
  opacity: 0;
  transform: scale(0.8);
}

.character .eyes {
  display: flex;
  gap: 14px;
}

.character .eye {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character .eye.white-eye {
  background: transparent;
}

.character .pupil {
  width: 10px;
  height: 10px;
  background: #1a1a2e;
  border-radius: 50%;
  transition: transform 0.08s ease-out;
}

.character .pupil.white {
  background: white;
  width: 8px;
  height: 8px;
}

.character .mouth {
  margin-top: 10px;
  transition: all 0.3s ease;
}

.character .mouth.smile {
  width: 24px;
  height: 12px;
  border: 3px solid #1a1a2e;
  border-top: none;
  border-radius: 0 0 24px 24px;
  background: transparent;
}

.character .mouth.smile.sad {
  transform: rotate(180deg);
  margin-top: 14px;
}

.character .mouth.smile.small {
  width: 16px;
  height: 8px;
  border-width: 2.5px;
}

.character .mouth.flat {
  width: 22px;
  height: 3px;
  background: #1a1a2e;
  border-radius: 2px;
}

.character .mouth.flat.worried {
  transform: rotate(-10deg);
}

/* 橙色圆形角色 */
.orange-ball {
  width: 200px;
  height: 200px;
  background: linear-gradient(145deg, #FF8C42 0%, #FF6B35 100%);
  border-radius: 50%;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.orange-ball .face {
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
}

.orange-ball .eyes {
  gap: 20px;
}

.orange-ball .eye {
  width: 28px;
  height: 28px;
}

.orange-ball .pupil {
  width: 14px;
  height: 14px;
}

.orange-ball .mouth.smile {
  width: 30px;
  height: 14px;
  margin-top: 14px;
}

/* 紫色方形角色 */
.purple-rect {
  width: 110px;
  height: 240px;
  background: linear-gradient(180deg, #7B68EE 0%, #6B5CE7 100%);
  border-radius: 14px;
  bottom: 0;
  left: 90px;
  z-index: 2;
}

.purple-rect .face {
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
}

.purple-rect .eyes {
  gap: 20px;
}

.purple-rect .eye {
  width: 20px;
  height: 20px;
}

.purple-rect .pupil {
  width: 10px;
  height: 10px;
}

/* 黑色方形角色 */
.black-rect {
  width: 65px;
  height: 130px;
  background: #1a1a2e;
  border-radius: 10px;
  bottom: 0;
  left: 185px;
  z-index: 3;
}

.black-rect .face {
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.black-rect .eyes {
  gap: 12px;
}

.black-rect .eye {
  width: 14px;
  height: 14px;
}

/* 黄色椭圆角色 */
.yellow-oval {
  width: 95px;
  height: 150px;
  background: linear-gradient(180deg, #FFD93D 0%, #F4C430 100%);
  border-radius: 50px;
  bottom: 0;
  left: 235px;
  z-index: 2;
}

.yellow-oval .face {
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
}

.yellow-oval .eyes {
  gap: 16px;
}

.yellow-oval .eye {
  width: 18px;
  height: 18px;
}

.yellow-oval .pupil {
  width: 9px;
  height: 9px;
}

/* 隐藏状态 - 输入密码时转身 */
.characters-group.hiding .orange-ball {
  transform: rotateY(180deg);
}

.characters-group.hiding .purple-rect {
  transform: rotateY(180deg) rotate(-8deg);
  transform-origin: bottom center;
}

.characters-group.hiding .black-rect {
  transform: rotateY(180deg);
}

.characters-group.hiding .yellow-oval {
  transform: rotateY(180deg);
}

/* 摇头状态 - 密码错误 */
.characters-group.shaking {
  animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-20px) rotate(-3deg); }
  20% { transform: translateX(20px) rotate(3deg); }
  30% { transform: translateX(-15px) rotate(-2deg); }
  40% { transform: translateX(15px) rotate(2deg); }
  50% { transform: translateX(-10px) rotate(-1deg); }
  60% { transform: translateX(10px) rotate(1deg); }
  70% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  90% { transform: translateX(-2px); }
}

/* 开心状态 - 登录成功 */
.characters-group.happy .orange-ball {
  animation: jump 0.5s ease;
}

.characters-group.happy .purple-rect {
  animation: jump 0.5s ease 0.1s;
}

.characters-group.happy .black-rect {
  animation: jump 0.5s ease 0.2s;
}

.characters-group.happy .yellow-oval {
  animation: jump 0.5s ease 0.15s;
}

@keyframes jump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

/* 右侧登录区域 */
.login-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: #fff;
}

.login-card {
  width: 100%;
  max-width: 360px;
}

.logo {
  margin-bottom: 36px;
}

.title {
  font-size: 30px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 36px 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  height: 48px;
  padding: 0 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  color: #1a1a2e;
  background: white;
  transition: all 0.2s ease;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #1a1a2e;
  box-shadow: 0 0 0 3px rgba(26, 26, 46, 0.08);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.password-input {
  position: relative;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: #1a1a2e;
  cursor: pointer;
}

.forgot-link {
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #1a1a2e;
}

.login-btn {
  height: 50px;
  background: #1a1a2e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.login-btn:hover {
  background: #2d2d4a;
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.google-btn {
  height: 50px;
  background: white;
  color: #374151;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.google-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.signup-text {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin-top: 28px;
}

.signup-text a {
  color: #1a1a2e;
  font-weight: 600;
  text-decoration: none;
}

.signup-text a:hover {
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
    min-height: auto;
  }

  .characters-section {
    padding: 60px 40px 40px;
    min-height: 320px;
  }

  .characters-group {
    transform: scale(0.85);
  }

  .login-section {
    padding: 30px 40px 50px;
  }
}

@media (max-width: 480px) {
  .characters-section {
    padding: 40px 20px 30px;
    min-height: 280px;
  }

  .characters-group {
    transform: scale(0.7);
  }

  .login-section {
    padding: 20px 24px 40px;
  }

  .title {
    font-size: 26px;
  }
}
</style>
