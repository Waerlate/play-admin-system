/**
 * JWT工具模块
 * 负责：
 * 1.生成token
 * 2.校验token
 */

const jwt = require('jsonwebtoken')

//实际项目应放入环境变量
const SECRET = 'prome_secret_key'

/**
 * 生成JWT Token
 * @param{Object} user-用户信息
 * @returns{String} token
 */
function generateToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
    }
    , SECRET,
        {expiresIn: '2h'}
    )
}

/**
 * 校验 JWT Token
 * @param{String} Token
 * @returns{Object} decoded payload
 */
function verifyToken(token) {
    return jwt.verify(token, SECRET)
}

module.exports = {
    generateToken,
    verifyToken
}