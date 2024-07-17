const mongoose = require("mongoose");
const db = require("../config/config");

const studentCoursesSchema = new mongoose.Schema(
  {
    fact: String,
    fact: String,
    dept: String,
    level: String,
    courseCode: String,
    courseTitle: String,
    semester: String,
    type: String,
    unit: String,
  },
  { timestamps: true }
);

const CoursesModel = db.coursesdb.model("coursesdb", studentCoursesSchema);

module.exports = CoursesModel;
