class BaseModel {
    constructor (result, message) {
        if (typeof result === 'string') {
            this.message = message
            result = null
            message = null
        }
        if (message) {
            this.message = message
        }
        if (result) {
            this.result = result
        }
    }
}

class SuccessModel extends BaseModel {
    constructor ({result, message = '操作成功', code = '000000'}) {
        super(result, message)
        this.success = true
        this.code = code
    }
}

class ErrorModel extends BaseModel {
    constructor ({result, message, code = '000004'}) {
        super(result, message)
        this.success = false
        this.code = code
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
