const mongoose = require('mongoose')

const {Schema, model} = mongoose

const recordSchema = new Schema({
    __v: {type: Number, select: false},
    personNumber: {type: Number, required: true},
    pictureUrl: {type: String, required: true},
    price: {type: Number, required: true},
    title: {type: String, required: true},
    updateTime: {type: Number, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    order: {type: Boolean, required: false, default: false, select: false},
    roomId: {type: Schema.Types.ObjectId, ref: 'Room'}
})

module.exports = model('Record', recordSchema)
