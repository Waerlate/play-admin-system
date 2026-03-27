const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')
const adminOnly = require('../middlewares/roleMiddleware')
const userController = require('../controllers/userController')

/**
 * 获取用户列表
 */
router.get(
    '/users',
    authMiddleware,
    adminOnly,
    userController.getUsers
)

/**
 * 新增用户
 */
router.post(
    '/users',
    authMiddleware,
    adminOnly,
    userController.createUser
)

/**
 * 删除用户
 */
router.delete(
    '/users/:id',
    authMiddleware,
    adminOnly,
    userController.deleteUser
)

/**
 * 更新用户
 */
router.put(
    '/users/:id',
    authMiddleware,
    adminOnly,
    userController.updateUser
)

module.exports = router