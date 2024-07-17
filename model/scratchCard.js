const mongoose = require('mongoose')

//mongoose help us to create schema(table)
const db = require('../config/config');

const scratchCardSchema = new mongoose.Schema({
    card : String
},{timestamps:true})

const scratchCard = db.generateCard.model('scratchCard', scratchCardSchema)

module.exports = scratchCard
