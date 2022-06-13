const City = require('../model/cities')
const {SuccessModel, ErrorModel} = require('../utils/resModel')

class CityCtl {
    // 查询所有
    async findAll (ctx) {
        const cities = await City.find()
        ctx.body = new SuccessModel({
            result: cities
        })
    }

    // 添加城市
    async create (ctx) {
        ctx.verifyParams({
            cityName: {type: 'string', required: true},
            cityCode: {type: 'string', match: ''}
        })
        const {cityName, cityCode} = ctx.request.body
        const city = await City.findOne({cityName, cityCode})
        console.log(!!city, city)
        if (city) {
            ctx.response.status = 409
            ctx.body = new ErrorModel({message: '该城市已存在'})
        } else {
            const result = new City({cityName, cityCode}).save()
            ctx.body = new SuccessModel({
                result,
                message: `${cityName} 新建成功`
            })
        }
    }

    // 删除城市
    async delete (ctx) {
        const {id: _id} = ctx.params
        const result = await City.findByIdAndRemove(_id)
        ctx.body = new SuccessModel({
            result,
            message: result ? '删除成功' : '城市不存在'
        })
    }

    // 查询单一城市
    async findOne (ctx) {
        const {id: _id} = ctx.params
        const {cityName = ''} = ctx.query
        const result = await City.findOne({$or: [{_id}, {cityName}]})
        let message
        if (!result) {
            ctx.response.status = 204
            message = '没有内容'
        }
        ctx.body = new SuccessModel({
            result,
            message
        })
    }
}

module.exports = new CityCtl()
