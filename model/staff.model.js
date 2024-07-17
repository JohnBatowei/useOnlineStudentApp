const mongoose = require('mongoose')

//mongoose help us to create schema(table)
const db = require('../config/config')
const staffSchema = new mongoose.Schema({
    name:{type:String,required:true,lowercase:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    staffId:{type:String},
    gender:String,
    dept:String,
    passport:String,
    fact:String,
    password:String,
},{timestamps:true})



const staffModel = db.staff.model('staff',staffSchema)
module.exports = staffModel