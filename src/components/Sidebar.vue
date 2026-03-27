<script setup>
import {ref,onMounted} from "vue";
import {useRouter,useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();

const handleSelect = (index) => {
  router.push(index)
}

const role = ref('');

onMounted(() => {
  role.value = localStorage.getItem("role");
})
</script>


<template>
<el-aside width="200px">
  <el-menu
      :default-active="route.path"
      @select="handleSelect"
      router
  >
    <el-menu-item index="/">首页Dashboard</el-menu-item>

    <el-menu-item v-if="role === 'admin'" index="/users">
      用户管理
    </el-menu-item>

    <el-menu-item index="/settings">系统设置</el-menu-item>
  </el-menu>
</el-aside>
</template>

