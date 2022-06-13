const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/users'})
const checkAuth = require('../utils/jwt')
const {
    register, findUser, login, findUserInfo,
    findRecordHistory, findOrderList
} = require('../controllers/users')
const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', findUser)
// 注册
router.post('/register', register)
// 登录
router.post('/login', login)
// 获取用户信息
router.get('/info', checkAuth, auth, findUserInfo)
// 获取用户预览历史
router.get('/recordHistory', auth, findRecordHistory)
// 获取用户预定列表
router.get('/orderList', auth, findOrderList)

module.exports = router
