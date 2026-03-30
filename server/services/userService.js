/**
 * 用户 Service 层
 * 负责：
 * 1. 与数据库交互
 * 2. 返回数据库操作结果
 */

const db = require('../config/db')

/**
 * 通用 query
 */
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}


function findUserById(id) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM users WHERE id = ?',
      [id],
      (err, result) => {
        if (err) reject(err)
        else resolve(result[0] || null)
      }
    )
  })
}


/**
 * 根据用户名查询用户
 */
function findUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (err, result) => {
                if (err) reject(err)
                else resolve(result)
            }
        )
    })
}

/**
 * 创建新用户（注册）
 */
function createUser(username, password, email, role = 'user') {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
            [username, password, email, role],
            (err, result) => {
                if (err) reject(err)
                else resolve(result)
            }
        )
    })
}

/**
 * 获取分页用户
 */
function getUsers(keyword, page, pageSize) {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * pageSize
        const likeKeyword = `%${keyword}%`

        const countSql = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE username LIKE ?
    `

        const dataSql = `
      SELECT id, username, role
      FROM users
      WHERE username LIKE ?
      LIMIT ? OFFSET ?
    `

        db.query(countSql, [likeKeyword], (err, countResult) => {
            if (err) return reject(err)

            const total = countResult[0].total

            db.query(
                dataSql,
                [likeKeyword, pageSize, offset],
                (err2, dataResult) => {
                    if (err2) reject(err2)
                    else resolve({
                        total,
                        data: dataResult
                    })
                }
            )
        })
    })
}

/**
 * 删除用户
 */
function deleteUser(id) {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM users WHERE id = ?',
            [id],
            (err, result) => {
                if (err) reject(err)
                else resolve(result)
            }
        )
    })
}

/**
 * 更新用户
 */
function updateUser(id, username, role) {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE users SET username = ?, role = ? WHERE id = ?',
            [username, role, id],
            (err, result) => {
                if (err) reject(err)
                else resolve(result)
            }
        )
    })
}

module.exports = {
    query,
    findUserById,
    findUserByUsername,
    createUser,
    getUsers,
    deleteUser,
    updateUser
}
