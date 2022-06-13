const Record = require('../model/record')
const User = require('../model/users')
const {ErrorModel, SuccessModel} = require('../utils/resModel')
class RecordCtr {
    // 添加历史记录
    async create (ctx) {
        ctx.verifyParams({
            personNumber: {type: 'number', required: true},
            pictureUrl: {type: 'string', required: true},
            price: {type: 'number', required: true},
            title: {type: 'string', required: true},
            userId: {type: 'string', required: true},
            roomId: {type: 'string', required: true}
        })
        const {userId, title} = ctx.request.body
        const record = await Record.findOne({userId, title})
        if (record) {
           ctx.params.id = record._id
           await new RecordCtr().update(ctx)
        } else {
            const record = await new Record({...ctx.request.body, updateTime: Date.now()}).save()
            await User.findByIdAndUpdate(userId, {
                $addToSet: {
                    recordId: record._id
                }
            })
            delete record.__v
            ctx.body = new SuccessModel({
                result: record,
                message: '创建成功'
            })
        }
    }
    // 删除历史记录
    async delete (ctx) {
        const {id} = ctx.params
        const record = await Record.findByIdAndRemove(id)
        ctx.body = new SuccessModel({
            result: record || {},
            message: '删除数据成功'
        })
    }

    // 更新历史记录
     async update(ctx) {
        const {id} = ctx.params
        const record = await Record.findByIdAndUpdate(id, {...ctx.request.body, updateTime: Date.now()})
        delete record.__v
        if (!record) {
            ctx.body = new ErrorModel({
                result: {},
                message: '无相关用户信息'
            })
        } else {
            ctx.body = new SuccessModel({
                result: record,
                message: '更新数据成功'
            })
        }
    }

    // 预定房间
    async orderRoom (ctx) {
        const {id} = ctx.params
        const {userId} = ctx.request.body
        const record = await Record.findByIdAndUpdate(id, {...ctx.request.body, updateTime: Date.now(), order: true})
        if (!record) {
            ctx.body = new ErrorModel({
                result: {},
                message: '无相关用户信息'
            })
        } else {
            await User.findByIdAndUpdate(userId, {
                $addToSet: {
                    orderId: record._id
                }
            })
            ctx.body = new SuccessModel({
                result: record,
                message: '更新数据成功'
            })
        }
    }

    //
    async cancelOrderRoom (ctx) {
        const {id} = ctx.params
        const {userId} = ctx.request.body
        const record = await Record.findByIdAndUpdate(id, {...ctx.request.body, updateTime: Date.now(), order: false})
        if (!record) {
            ctx.body = new ErrorModel({
                result: {},
                message: '无相关用户信息'
            })
        } else {
            await User.findByIdAndUpdate(userId, {
                $pull: {
                    orderId: {
                        $elemMatch: {$eq:  record._id}
                    }
                }
            })
            ctx.body = new SuccessModel({
                result: record,
                message: '更新数据成功'
            })
        }
    }

    // 查询历史记录
    async findList (ctx) {
        const result = await Record.find().select('+order')
        ctx.body = new SuccessModel({result})
    }
}

module.exports = new RecordCtr()
