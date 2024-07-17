const mongoose = require('mongoose')
//mongoose help us to create schema(table)
const db = require('../config/config')
const factSchema = new mongoose.Schema({
    fact:{type:String,lowercase:true},
    dept:[{type:String,lowercase:true}]
  
},{timestamps:true})

const faculty = db.admindb.model('faculty',factSchema)
module.exports = faculty