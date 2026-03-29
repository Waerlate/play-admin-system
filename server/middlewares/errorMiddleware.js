/**
 * 全局错误处理中间件
 * 统一处理服务器异常
 */
function errorMiddleware(err,req, res, next) {
    console.error("The server is error!",err.message)

    if (res.headerSent) {
        return next(err)
    }

    res.status(500).json({
        message: "Internal server error",
    })
}

module.exports = errorMiddleware