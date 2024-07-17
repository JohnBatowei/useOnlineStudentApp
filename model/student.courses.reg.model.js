const mongoose = require('mongoose');
const db = require('../config/config')
const studentCoursesSchema = new mongoose.Schema({
  studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'student'},
  session: String,
  level: String,
  semester: String,
  matNo: String,
  courses: [
    {
      title: { type: String },
      courseCode: { type: String },
      courseUnit: { type: String },
      type: { type: String },
      withResult: {type: String, default: 'no'}
    }
  ],
  status: { type: Boolean, default: false },
  totalUnit: String,
  studentName: String
}, { timestamps: true });

const studentCoursesRegModel = db.regCourses.model('studentCourses', studentCoursesSchema);

module.exports = studentCoursesRegModel;
