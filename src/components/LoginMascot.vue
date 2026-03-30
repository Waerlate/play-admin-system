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
  min-width: 280px;
  padding: 20px;
}

.character {
  width: 160px;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 20px 40px rgba(102, 126, 234, 0.3),
    0 0 0 8px rgba(102, 126, 234, 0.1),
    inset 0 -8px 20px rgba(0, 0, 0, 0.1);
}

.character::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 30px;
  width: 30px;
  height: 15px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: rotate(-30deg);
}

/* 眼睛 */
.eye {
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 45px;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left-eye {
  left: 35px;
}

.right-eye {
  right: 35px;
}

.pupil {
  width: 14px;
  height: 14px;
  background: #1a1a2e;
  border-radius: 50%;
  position: absolute;
  top: 11px;
  left: 11px;
  transition: transform 0.1s ease-out;
}

.pupil::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
}

/* 嘴巴 */
.mouth {
  width: 50px;
  height: 22px;
  border-bottom: 4px solid #1a1a2e;
  border-radius: 0 0 50px 50px;
  position: absolute;
  left: 50%;
  bottom: 38px;
  transform: translateX(-50%);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 腮红 */
.blush {
  width: 22px;
  height: 10px;
  background: rgba(255, 182, 193, 0.6);
  border-radius: 50%;
  position: absolute;
  top: 88px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.left-blush {
  left: 16px;
}

.right-blush {
  right: 16px;
}

/* 密码聚焦：捂眼睛动画 */
.character.hide {
  transform: scale(0.95);
}

.character.hide .eye {
  height: 4px;
  background: #1a1a2e;
  top: 62px;
  border-radius: 4px;
}

.character.hide .pupil {
  opacity: 0;
}

.character.hide .mouth {
  width: 30px;
  height: 0;
  border-bottom: 3px solid #1a1a2e;
  border-radius: 0;
}

.character.hide .blush {
  opacity: 1;
  top: 75px;
}

/* 登录失败 */
.character.error {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  box-shadow:
    0 20px 40px rgba(238, 90, 90, 0.3),
    0 0 0 8px rgba(238, 90, 90, 0.1);
}

@keyframes shake {
  0%, 100% { transform: translateX(0) rotate(0); }
  20% { transform: translateX(-8px) rotate(-5deg); }
  40% { transform: translateX(8px) rotate(5deg); }
  60% { transform: translateX(-6px) rotate(-3deg); }
  80% { transform: translateX(6px) rotate(3deg); }
}

.character.error .mouth {
  border-bottom: none;
  border-top: 4px solid #1a1a2e;
  border-radius: 50px 50px 0 0;
  height: 18px;
  bottom: 32px;
}

.character.error .blush {
  opacity: 0;
}

/* 登录成功 */
.character.success {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
  transform: scale(1.08);
  box-shadow:
    0 20px 40px rgba(86, 171, 47, 0.3),
    0 0 0 8px rgba(86, 171, 47, 0.1);
}

.character.success .mouth {
  height: 28px;
  width: 55px;
  border-radius: 0 0 80px 80px;
  border-bottom-width: 5px;
}

.character.success .blush {
  opacity: 1;
  background: rgba(255, 182, 193, 0.8);
}

.character.success .eye {
  transform: scale(1.1);
}

/* 眨眼 */
.eye.closed {
  height: 4px;
  background: #1a1a2e;
  top: 62px;
  border-radius: 4px;
}

.eye.closed .pupil {
  opacity: 0;
}

.mascot-tip {
  margin-top: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  color: #4c3d8f;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
</style>