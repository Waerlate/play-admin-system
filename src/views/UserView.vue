<script setup>
import {ref,reactive,onMounted} from "vue";
import request from "@/utils/request";

//表格数据
const tableData = ref([]);

//分页参数
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

//搜索关键字
const keyword = ref("");

//弹窗显示
const dialogVisible = ref(false);

//是否编译模式
const isEdit = ref(false);

//当前编辑的用户id
const currentId = ref(null)

//表单数据
const form = reactive({
  username: "",
  role: 'user'
})

//获取用户列表
const fetchUsers = async () => {
  try {
    const res = await request.get('/api/users',{
      params: {
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value
      }
    })

    tableData.value = res.data.data.data || []
    total.value = res.data.data.total || 0
  }catch (error) {
    console.error('Failed to fetch user', error);
  }
}

//搜索
const handleSearch = () => {
  page.value = 1
  fetchUsers()
}

//分页切换
const handleCurrentChange = (newPage) => {
  page.value = newPage;
  fetchUsers()
}

//打开新增弹窗
const openAddDialog = () => {
  isEdit.value = false
  currentId.value = null
  form.username =''
  form.role ='user'
  dialogVisible.value = true
}

//打开编译弹窗
const openEditDialog = (row) => {
  isEdit.value = true
  currentId.value = row.id
  form.username = row.username
  form.role = row.role
  dialogVisible.value = true
}

//保存（新增/编辑）
const handleSave = async() => {
  try {
    if (isEdit.value) {
      await request.put(`/api/users/${currentId.value}`, {
        username: form.username,
        role: form.role,
      })
    }else {
      await request.post('/api/users', {
        username: form.username,
        role: form.role,
      })
    }

    dialogVisible.value = false
    fetchUsers()
  } catch (error) {
    console.error('保存失败', error);
  }
}

//删除
const handleDelete = async(id) => {
  try {
    await request.delete(`/api/users/${id}`)
    fetchUsers()
  } catch (error) {
    console.error('删除失败', error);
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="user-page">
    <h2>用户管理</h2>

    <div class="toolbar">
    <el-input
      v-model="keyword"
      placeholder="请输入用户名搜索"
      style="width: 240px;margin-right: 12px"
      clearable
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" style="margin-left: 12px" @click="openAddDialog">
        新增用户
      </el-button>
    </div>

    <el-table :data="tableData" style="width: 100%;margin-top: 20px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色" />

      <el-table-column label="操作" width="220">
       <template #default="scope">
         <el-button size="small" type="primary" @click="openEditDialog(scope.row)">
           编译
           </el-button>
         <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
           删除
           </el-button>
         </template>
        </el-table-column>
      </el-table>

    <div style="margin-top: 20px;display: flex;justify-content: flex-end">
      <el-pagination
      background
      layout="prev, pager, next,total"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户' "
      width="400px"
      >

      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"/>
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="管理员" value="admin"/>
            <el-option label="普通用户" value="user"/>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
        </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-page {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
}
</style>