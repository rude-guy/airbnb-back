const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/room'})
const {secret} = require('../config')
const {
    create, delete: deleteRoom,
    findDetail, modifyRoom, findAll,
    findCityList
} = require('../controllers/rooms')
const auth = jwt({secret})


router.get('/test', findAll)
// 添加房屋
router.post('/create', auth, create)
// 修改房屋信息
router.patch('/modify/:id', auth, modifyRoom)
//  删除房屋
router.delete('/delete/:id', auth, deleteRoom)
// 查找房屋详情
router.get('/findDetail/:id', findDetail)
// 查指定城市房屋列表
router.get('/roomList', findCityList)

// 查指定城市房屋


module.exports = router

