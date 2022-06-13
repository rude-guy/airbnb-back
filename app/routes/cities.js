const Router = require('koa-router')
const router = new Router({prefix: '/cities'})
const jwt = require('koa-jwt')
const {findAll, create, delete: deleteCity, findOne} = require('../controllers/cities')
const {secret} = require('../config')

const auth = jwt({secret})

// 查询所有
router.get('/findAll', findAll)
// 添加城市
router.post('/create', auth, create)
// 删除城市
router.delete('/delete/:id', auth, deleteCity)
// 查询单一城市
router.get('/findOne/:id', findOne)

module.exports = router
