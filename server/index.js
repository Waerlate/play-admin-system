/**
 * 应用接口文件
 * 负责：
 * 1.初始化
 * 2.注册中间件
 * 3.注册路由
 * 4.启动服务
 */

require('dotenv').config()
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(cors());
app.use(express.json());

//注册路由
app.use('/api',authRoutes);
app.use('/api',userRoutes);

app.use(errorMiddleware);

//启动服务器
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
