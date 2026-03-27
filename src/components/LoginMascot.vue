<template>
  <div class="mascot-wrapper" @mousemove="handleMouseMove">
    <div
        class="character"
        :class="{
        hide: isPasswordFocus,
        error: loginStatus === 'error',
        success: loginStatus === 'success'
      }"
        ref="characterRef"
    >
      <div class="eye left-eye">
        <div class="pupil" ref="leftPupil"></div>
      </div>

      <div class="eye right-eye">
        <div class="pupil" ref="rightPupil"></div>
      </div>

      <div class="mouth"></div>
      <div class="blush left-blush"></div>
      <div class="blush right-blush"></div>
    </div>

    <div class="mascot-tip">
      {{ isPasswordFocus ? '我先回避一下 👀' : '欢迎登录 ✨' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isPasswordFocus: {
    type: Boolean,
    default: false
  },
  loginStatus: {
    type: String,
    default: ''
  }
})

const characterRef = ref(null)
const leftPupil = ref(null)
const rightPupil = ref(null)

let blinkTimer = null

const handleMouseMove = (e) => {
  if (!characterRef.value || props.isPasswordFocus) return

  const rect = characterRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const dx = e.clientX - centerX
  const dy = e.clientY - centerY

  const angle = Math.atan2(dy, dx)

  const moveX = Math.cos(angle) * 6
  const moveY = Math.sin(angle) * 6

  if (leftPupil.value) {
    leftPupil.value.style.transform = `translate(${moveX}px, ${moveY}px)`
  }

  if (rightPupil.value) {
    rightPupil.value.style.transform = `translate(${moveX}px, ${moveY}px)`
  }
}

const blink = () => {
  const eyes = document.querySelectorAll('.eye')
  eyes.forEach((eye) => eye.classList.add('closed'))

  setTimeout(() => {
    eyes.forEach((eye) => eye.classList.remove('closed'))
  }, 180)
}

onMounted(() => {
  blinkTimer = setInterval(blink, 3000)
})

onUnmounted(() => {
  clearInterval(blinkTimer)
})
</script>

<style scoped>
.mascot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 320px;
  padding: 20px;
}

.character {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #ffd54f, #ffb300);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

/* 眼睛 */
.eye {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.left-eye {
  left: 38px;
}

.right-eye {
  right: 38px;
}

.pupil {
  width: 14px;
  height: 14px;
  background: #111;
  border-radius: 50%;
  position: absolute;
  top: 13px;
  left: 13px;
  transition: transform 0.08s linear;
}

/* 嘴巴 */
.mouth {
  width: 58px;
  height: 26px;
  border-bottom: 5px solid #222;
  border-radius: 0 0 60px 60px;
  position: absolute;
  left: 50%;
  bottom: 42px;
  transform: translateX(-50%);
  transition: all 0.3s ease;
}

/* 腮红 */
.blush {
  width: 26px;
  height: 12px;
  background: rgba(255, 105, 135, 0.45);
  border-radius: 50%;
  position: absolute;
  top: 100px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.left-blush {
  left: 18px;
}

.right-blush {
  right: 18px;
}

/* 密码聚焦：隐藏眼睛，像回避 */
.character.hide .eye {
  opacity: 0;
  transform: translateY(-6px);
}

.character.hide .mouth {
  width: 40px;
  height: 0;
  border-bottom: 4px solid #333;
  border-radius: 0;
}

/* 登录失败 */
.character.error {
  background: linear-gradient(135deg, #b388ff, #7c4dff);
  transform: rotate(-8deg);
}

.character.error .mouth {
  border-bottom: none;
  border-top: 5px solid #b71c1c;
  border-radius: 60px 60px 0 0;
  height: 24px;
  bottom: 34px;
}

/* 登录成功 */
.character.success {
  background: linear-gradient(135deg, #81c784, #43a047);
  transform: scale(1.04);
}

.character.success .mouth {
  height: 36px;
  border-radius: 0 0 90px 90px;
}

.character.success .blush {
  opacity: 1;
}

/* 眨眼 */
.eye.closed {
  height: 5px;
  background: #222;
  top: 68px;
}

.eye.closed .pupil {
  opacity: 0;
}

.mascot-tip {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}
</style>