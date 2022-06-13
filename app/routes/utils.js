const Router = require('koa-router')
const router = new Router()
const jwt = require('koa-jwt')
const {secret} = require('../config')
const {upload} = require('../controllers/utils')

const auth = jwt({secret})

router.post('/upload', auth, upload)

module.exports = router
