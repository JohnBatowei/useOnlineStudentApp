const mongoose = require('mongoose')

// const student = process.env.student
const studuent_app = process.env.studuent_app_online || process.env.studuent_app
// const admin = process.env.admindb
// const staff = process.env.staff
// const result = process.env.result
// const courses = process.env.coursesdb
// const studentCourses = process.env.studentCourses
// const generateCard = process.env.generateScratchCard
// const regCourses = process.env.regCourses


// mongoose.set('strictQuery',true)

// const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true,}

mongoose.student = mongoose.createConnection(studuent_app)
mongoose.admindb = mongoose.createConnection(studuent_app)
mongoose.staff = mongoose.createConnection(studuent_app)
mongoose.result = mongoose.createConnection(studuent_app)
mongoose.coursesdb = mongoose.createConnection(studuent_app)
mongoose.studentCourses = mongoose.createConnection(studuent_app)
mongoose.generateCard = mongoose.createConnection(studuent_app)
mongoose.regCourses = mongoose.createConnection(studuent_app)


module.exports = mongoose