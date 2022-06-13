const mongoose = require('mongoose')

const {Schema, model} = mongoose

const userSchema = new Schema({
    __v: {type: Number, select: false},
    username: {type: String, default: '哇哈哈哈'},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    avatar_url: {type: String, default: '/uploads/1.jpg'},
    recordId: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Record'
            }
        ],
        select: false
    },
    orderId: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Record'
            }
        ],
        select: false
    },
})

module.exports = model('User', userSchema)
