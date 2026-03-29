/**管理员权限中间件
 * 功能
 * 检查当前用户是否为admin
 */

function adminOnly(req, res, next) {
    if (req.user.role !== 'admin') {
        console.error('You do not have permission to perform this action.');
        return res.status(403).json({message: 'No permission to access'});
    }
    next();
}

module.exports = adminOnly;