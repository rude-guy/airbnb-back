const Router = require('koa-router')
const router = new Router({prefix: '/record'})
const jwt = require('koa-jwt')
const {
    create, delete: deleteRecord, findList,
    update, orderRoom, cancelOrderRoom
} = require('../controllers/record')
const {secret} = require('../config')
const auth = jwt({secret})


// 添加历史记录
router.post('/create', auth, create)
// 删除历史记录
router.delete('/delete/:id', auth, deleteRecord)
// 更新历史记录
router.patch('/update/:id', auth, update)
// 查询历史记录
router.get('/findList', auth, findList)
// 预定房间
router.patch('/orderRoom/:id', auth, orderRoom)
// 取消预定房间
router.patch('/cancelOrderRoom/:id', auth, cancelOrderRoom)

module.exports = router
