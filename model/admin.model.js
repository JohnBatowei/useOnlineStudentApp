const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//mongoose help us to create schema(table)
const db = require('../config/config');

const adminSchema = new mongoose.Schema({
    passport:{type:String, unique:true},
    name:{type:String,required:true,lowercase:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:String,
},{timestamps:true})

adminSchema.pre('save',async function(next){
   try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next()
   } catch (error) {
    next(error)
   }
})

const adminModel = db.admindb.model('adminDB',adminSchema)
// const adminModel = mongoose.model('admindb',adminSchema)
module.exports = adminModel