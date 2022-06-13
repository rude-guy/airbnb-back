const {ObjectId} = require('mongodb')
const Room = require('../model/room')
const {SuccessModel, ErrorModel} = require('../utils/resModel')

class RoomsCtl {
    // 添加房屋
    async create (ctx) {
        ctx.verifyParams({
            city: {type: 'string', required: true},
            title: {type: 'string', required: true},
            price: {type: 'number', required: true},
            pictureUrl: {type: 'string', required: true},
            imgs: {type: 'array', itemType: 'string', required: true},
            info: {
                type: 'object',
                rule: {
                    room: {type: 'number', required: true, default: 0},
                    bed: {type: 'number', required: true, default: 0},
                    toilet: {type: 'number', required: true, default: 0},
                    liveNumber: {type: 'number', required: true, default: 0},
                    remarks: {type: 'number', required: true, default: false},
                    parking: {type: 'boolean', required: true, default: false},
                    metro: {type: 'boolean', required: true, default: false},
                    luggage: {type: 'boolean', required: true, default: false}
                },
                required: true
            },
            certify: {type: 'boolean', required: true},
            introduce: {type: 'string', required: true}
        })
        const {_id} = ctx.state.user
        const result = new Room({...ctx.request.body, owner: _id}).save()
        ctx.body = new SuccessModel({
            result
        })
    }

    // 修改房屋信息
    async modifyRoom (ctx) {
        ctx.verifyParams({
            city: {type: 'string', required: false},
            title: {type: 'string', required: false},
            price: {type: 'number', required: false},
            pictureUrl: {type: 'string', required: false},
            imgs: {type: 'array', itemType: 'string', required: false},
            info: {
                type: 'object',
                rule: {
                    room: {type: 'number', required: false},
                    bed: {type: 'number', required: false},
                    toilet: {type: 'number', required: false},
                    liveNumber: {type: 'number', required: false},
                    remarks: {type: 'number', required: false},
                    parking: {type: 'boolean', required: false},
                    metro: {type: 'boolean', required: false},
                    luggage: {type: 'boolean', required: false}
                },
                required: false
            },
            certify: {type: 'boolean', required: false},
            introduce: {type: 'string', required: false}
        })
        const {id} = ctx.params
        const result = await Room.findByIdAndUpdate(id, ctx.request.body)
        ctx.body = new SuccessModel({
            result,
            message: '修改成功'
        })
    }

    // 删除房屋
    async delete (ctx) {
        const {id} = ctx.params
        await Room.findByIdAndRemove(id).select('+info +certify').populate('city owner')
        ctx.body = new SuccessModel({
            result: {},
            message: '删除成功'
        })
    }

    // 查找房屋详情
    async findDetail (ctx) {
        const {id} = ctx.params
        const result = await Room.findById(id).select('+info +certify -pictureUrl -city').populate('owner')
        if (!result) {
            ctx.body = new ErrorModel({result: {}, message: '无相关房屋信息'})
        } else {
            ctx.body = new SuccessModel({result})
        }
    }

    // 查指定城市房屋列表
    async findCityList (ctx) {
        let {cityId, pageSize = 10, pageNo = 0} = ctx.query
        pageSize = Math.max(pageSize, 1)
        pageNo = Math.max(pageNo, 1) - 1
        try {
            const roomList = await Room.aggregate([
                {$match: {city: ObjectId(cityId)}},
                {
                    $facet: {
                        total: [{
                            $count: "total"
                        }],
                        data: [
                            {$skip: pageNo * pageSize},
                            {$limit: pageSize}
                        ]
                    }
                }
            ])
            const result = {
                total: roomList[0].total[0]?.total || 0,
                pageSize,
                pageNo,
                orders: {
                    data: []
                }
            }
            result.orders.data = roomList[0].data.map(room => ({
                id: room._id,
                title: room.title,
                price: room.price,
                pictureUrl: room.pictureUrl
            }))
            ctx.body = new SuccessModel({result})
        } catch (err) {
            ctx.body = new ErrorModel({result: {}, message: 'cityId error'})
        }
    }

    //
    async findAll (ctx) {
        const count = await Room.find().count()
        console.log(count)
        ctx.body = await Room.find().select('+info +certify').populate('city owner')
        // ctx.body = await Room.find()
    }
}

module.exports = new RoomsCtl()
