/**
 * 认证路由
 */

const Joi = require('joi');
const validate = require('../middlewares/validateMiddleware');

//定义schema
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required()
})

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
    '/register',
    validate(registerSchema),
    authController.register
);

router.post('/login', authController.login);

module.exports = router;