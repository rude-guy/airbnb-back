const User = require('../model/users')
const jsonwebtoken = require('jsonwebtoken')
const {SuccessModel, ErrorModel} = require('../utils/resModel')
const {secret} = require('../config')

class UsersCtl {
    // 登录
    async login (ctx) {
        ctx.verifyParams({
            email: {type: 'email', required: true, allowEmpty: false},
            password: {type: 'string', required: true}
        })
        const {email, password} = ctx.request.body
        const user = await User.findOne({email, password})
        if (!user) {
            ctx.body = new ErrorModel({
                result: {},
                message: '邮箱或密码错误'
            })
        } else {
            const {_id} = user
            const token = jsonwebtoken.sign({_id, email}, secret, {expiresIn: '2d'})
            ctx.body = new SuccessModel({
                result: {token},
                message: '登录成功'
            })
        }

    }

    // 注册
    async register (ctx) {
        ctx.verifyParams({
            email: {type: 'email', required: true, allowEmpty: false},
            password: {type: 'string', required: true}
        })
        const {email, name} = ctx.request.body
        let repeatedUser = await User.findOne({email, name})
        if (repeatedUser) {
            ctx.response.status = 409
            ctx.body = new ErrorModel({message: '用户已存在'})
        } else {
            const result = new User(ctx.request.body).save()
            ctx.body = new SuccessModel({
                result,
                message: '注册成功'
            })
        }
    }

    // 查找所有用户
    async findUser (ctx) {
        const users = await User.find().select('+orderId +recordId').populate('orderId recordId')
        ctx.body = new SuccessModel({
            result: users,
            message: '操作成功',
        })
    }

    // 获取用户信息
    async findUserInfo (ctx) {
        const {_id} = ctx.state.user
        const users = await User.findById(_id)
        ctx.body = new SuccessModel({
            result: users,
            message: '操作成功',
            code: '000004'
        })
    }

    // 获取用户预览历史
    async findRecordHistory (ctx) {
        const {_id} = ctx.state.user
        const user = await User.findById(_id).select('+recordId').populate('recordId')
        ctx.body = new SuccessModel({
            result: user?.recordId || []
        })
    }
    // 获取用户预定列表
    async findOrderList (ctx) {
        const {_id} = ctx.state.user
        const user = await User.findById(_id).select('+orderId').populate('orderId')
        ctx.body = new SuccessModel({
             result: user?.orderId || []
        })
    }
}

module.exports = new UsersCtl()
