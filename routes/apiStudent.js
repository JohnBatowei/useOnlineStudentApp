var express = require("express");

const auth = require("../auth/auth");
var router = express.Router();
const upload = require("../multer");
const {
  createStudentSignup,
  loginStudent,
  panel,
  studentDept,
  courseRegistration,
  createRegistration,
  studentCourseRegistration,
  deleteCourse,
  deleteRegistrationForm,
  saveRegistrationForm,
  viewRegistrateredCourses,
  checkResult,checkResultStudent
} = require("../controllers/student.con");

router.post("/signup", upload.single("file"), createStudentSignup);
router.post("/login", loginStudent);
router.get("/panel", auth.isStudent, panel);
router.get("/check-result", auth.isStudent, checkResult);
router.get("/course-registration", auth.isStudent, courseRegistration);


// fetch the student department after the student has selected his faculty
router.post("/fetch-depts", studentDept);


// create-registration
router.post("/create-registration", auth.isStudent, createRegistration);
router.post("/student-course-registration", auth.isStudent, studentCourseRegistration);
router.delete("/delete-course",auth.isStudent, deleteCourse);
router.delete("/delete-registration-form",auth.isStudent, deleteRegistrationForm);
router.put("/save-registration",auth.isStudent, saveRegistrationForm);
router.get("/view-registered-courses/:id", auth.isStudent, viewRegistrateredCourses);
router.get("/check-result/:id", auth.isStudent, checkResultStudent);


module.exports = router;