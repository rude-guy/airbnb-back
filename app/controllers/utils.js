const {SuccessModel} = require('../utils/resModel')

class UtilsCtl {
    async upload (ctx) {
        let file = ctx.request.files.file
        console.log(`${ctx.origin}/uploads/${file.newFilename}`)
        ctx.body = new SuccessModel({
            result: {
                url: `${ctx.origin}/uploads/${file.newFilename}`
            },
            message: '上传成功'
        })
    }
}

module.exports = new UtilsCtl()
