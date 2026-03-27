/**
 * 登录验证中间件
 * 功能：
 * 1.检查是否携带Authorization
 * 2.校验JWT
 * 3.将用户信息挂载到req.user
 */

 const {verifyToken} = require('../utils/jwt')
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log('Unauthorized');
        return res.status(401).json({error: 'Unauthorized'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }catch {
        console.log('Token is missing or overtime');
        return res.status(401).json({message: 'token is messing or overtime'});
    }
}

module.exports = authMiddleware;