const Koa = require('koa')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
const koaStatic = require('koa-static')
const routing = require('./routes')
const config = require('./config')
const app = new Koa()

mongoose.connect(config.connectionUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB连接异常: '))
db.once('open', function () {
    console.log('MongoDB 连接成功')
})

app.use(async (ctx, next) => {
    ctx.append('Access-Control-allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', '*')
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PATCH')
    await next()
})

app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error({
    postFormat: (e, {stack, ...rest}) =>
        process.env.NODE_ENV === 'production'
            ? rest : {stack, ...rest}
}))

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true
    }
}))

app.use(parameter(app))
routing(app)

app.listen(3001, () => {
    console.log('listener is port 3001')
})
