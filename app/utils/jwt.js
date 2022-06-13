const {ErrorModel} = require('./resModel')

async function checkAuth (ctx, next) {
    await next().catch((err) => {
        ctx.response.status = 401
        ctx.body = new ErrorModel({
            message: 'Authentication Error',
            code: '000001'
        })
    })
}

module.exports = checkAuth
