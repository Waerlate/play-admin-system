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
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <h2>用户管理</h2>
        <p>管理系统中的所有用户账户</p>
      </div>
      <el-button type="primary" class="add-btn" @click="openAddDialog">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 6px;">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新增用户
      </el-button>
    </div>

    <!-- 搜索工具栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <el-input
          v-model="keyword"
          placeholder="搜索用户名..."
          clearable
          @keyup.enter="handleSearch"
        />
      </div>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名">
          <template #default="scope">
            <div class="user-cell">
              <div class="user-avatar">
                {{ scope.row.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <span>{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'primary' : 'info'" effect="light">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="openEditDialog(scope.row)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 4px;">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除该用户吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger" link>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 4px;">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <span class="total-info">共 {{ total }} 条记录</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="480px"
      class="user-dialog"
    >
      <el-form label-width="80px" class="user-form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large"/>
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%" size="large">
            <el-option label="管理员" value="admin"/>
            <el-option label="普通用户" value="user"/>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false" size="large">取消</el-button>
        <el-button type="primary" @click="handleSave" size="large">
          {{ isEdit ? '保存修改' : '创建用户' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-info h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.header-info p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  font-weight: 500;
  border-radius: 10px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
  z-index: 10;
}

.search-input-wrapper :deep(.el-input__wrapper) {
  padding-left: 42px;
  border-radius: 10px;
  height: 44px;
}

.search-bar .el-button {
  height: 44px;
  padding: 0 24px;
  border-radius: 10px;
}

/* 表格 */
.table-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.table-wrapper :deep(.el-table th.el-table__cell) {
  background: #f8fafc !important;
  padding: 16px 12px;
  font-weight: 600;
  color: #374151;
}

.table-wrapper :deep(.el-table td.el-table__cell) {
  padding: 16px 12px;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.total-info {
  font-size: 14px;
  color: #6b7280;
}

/* 弹窗 */
.user-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.user-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.user-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.user-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.user-form :deep(.el-input__wrapper) {
  border-radius: 10px;
}

.user-form :deep(.el-select .el-input__wrapper) {
  border-radius: 10px;
}
</style>