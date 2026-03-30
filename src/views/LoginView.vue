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
    const res = await request.post('/login', form)
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
    <div class="login-card">
      <!-- 左侧动画角色 -->
      <div class="login-left">
        <LoginMascot
            :is-password-focus="isPasswordFocus"
            :login-status="loginStatus"
        />
      </div>

      <!-- 右侧登录区域 -->
      <div class="login-right">
        <h2>系统登录</h2>

        <el-form>
          <el-form-item label="用户名">
            <el-input
                v-model="form.username"
                placeholder="请输入用户名"
            />
          </el-form-item>

          <el-form-item label="密码">
            <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                @focus="isPasswordFocus = true"
                @blur="isPasswordFocus = false"
            />
          </el-form-item>

          <el-button type="primary" style="width: 100%" @click="handleLogin">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>



<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f8fc, #eef1f7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  width: 900px;
  min-height: 480px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.login-left {
  width: 45%;
  background: #f6f3ff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-right {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-right h2 {
  margin-bottom: 30px;
  font-size: 30px;
  color: #222;
}
</style>
