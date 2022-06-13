const mongoose = require('mongoose')

const {Schema, model} = mongoose

const citySchema = new Schema({
    __v: {type: Number, required: false, select: false},
    cityName: {type: String, required: true},
    cityCode: {type: String, required: true}
})

module.exports = model('City', citySchema)
