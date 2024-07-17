const mongoose = require('mongoose')
//mongoose help us to create schema(table)
const db = require('../config/config')
const resultSchema = new mongoose.Schema({
    studentId:{type: mongoose.Schema.Types.ObjectId, ref: 'student'},
    session:{type:String},
    matNo : {type:String},
    semester:{type:String},
    level:{type:String},
    courses:[
        {
            staffId:{type:String},
            courseTitle:{type:String},
            coursCode:{type:String},
            score:Number,
            grade:{type:String,uppercase:true},
        }
    ]
},{timestamps:true})

const resultModel = db.result.model('result',resultSchema)
module.exports = resultModel