const mongoose = require('mongoose')

const {Schema, model} = mongoose

const roomSchema = new Schema({
    __v: {type: Number, select: false},
    city: {type: Schema.Types.ObjectId, ref: 'City'},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    pictureUrl: {type: String, required: true},
    imgs: {type: [String], required: true},
    info: {
        type: {
            room: {type: Number, required: true, default: 0},
            bed: {type: Number, required: true, default: 0},
            toilet: {type: Number, required: true, default: 0},
            liveNumber: {type: Number, required: true, default: 0},
            remarks: {type: Number, required: true, default: false},
            parking: {type: Boolean, required: true, default: false},
            metro: {type: Boolean, required: true, default: false},
            luggage: {type: Boolean, required: true, default: false},
        },
        select: false
    },
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    certify: {type: Boolean, required: true, default: false, select: false},
    introduce: {type: String, required: true, default: false}
})

module.exports = model('Room', roomSchema)

