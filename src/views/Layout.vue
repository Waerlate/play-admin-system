<script setup>
import Sidebar from "@/components/Sidebar.vue";
import { useUserStore} from "@/store/user";
import { useRouter } from "vue-router";
import {onMounted} from "vue";
import request from "@/utils/request.js";

const userStore = useUserStore();
const router = useRouter();


//登出
const logout = () =>{
  userStore.logout();
  router.push("/login");
}

onMounted(() =>{
  if (userStore.token) {
    request.get('api/users')
  }
})
</script>


<template>

  <el-button type="danger" @click="logout">
    退出登录
  </el-button>

    <el-container style="height: 100vh">
      <Sidebar />

      <el-container>
        <el-header>
          后台管理系统 - 管理员
        </el-header>

        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
</template>
