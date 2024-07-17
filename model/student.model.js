const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
//mongoose help us to create schema(table)
const db = require('../config/config')
const studentSchema = new mongoose.Schema({
    name:{type:String,required:true,lowercase:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    matNo:{type:String,lowercase:true},
    gender:String,
    dept:String,
    scratchCard:String,
    phone:Number,
    passport:{type :String, unique:true},
    fact:String,
    password:String
},{timestamps:true})

// studentSchema.pre('save',async function(next){
//     try {
//      const salt = await bcrypt.genSalt(10);
//      this.password = await bcrypt.hash(this.password,salt)
//      next()
//     } catch (error) {
//      next(error)
//     }
//  })


const studentModel = db.student.model('student',studentSchema)
module.exports = studentModel