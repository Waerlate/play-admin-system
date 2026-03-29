/**
 * 认证控制器
 * 负责：
 * 1.注册逻辑
 * 2.登录逻辑
 */

const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const userService = require("../services/userService");
const { success,fail } = require("../utils/response");

/**
 * 注册
 */
async function register(req, res, next) {
    try {
        const { username,password,email } = req.body;

        if (!username || !password) {
            console.log("Username and password are required");
            return fail(res,"Username and password are required");
        }

        const hash = await bcrypt.hash(password, 10);

        await userService.createUser(username,hash,email);

        return success(res,null,"Register success!");
    }catch (err){

        if (err.code === "ER_DUP_ENTRY") {
            console.log("User already exists!");
            return fail(res,"User already exists!");
        }

        next(err);  //交给全局错误中间件
    }
}

/**
 * 登录
 */
async function login(req, res, next) {
    try {
        const {username, password,} = req.body;

        const results = await userService.findUserByUsername(username);

        if (results.length === 0) {
            console.log("User is not found!")
            return fail(res,"User is not found!");
        }


        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            console.log("Passwords do not match!");
            return fail(res,"Passwords do not match!");
        }

        const token = generateToken(user);

        return success(
            res,
            {token,role:user.role},
            "Login success!"
        );
    }catch (err){
        next(err);
    }
}

module.exports = {
    register,
    login,
}