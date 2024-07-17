var express = require("express");
const {
  getAdminPage,
  createAdminSignup,
  loginAdmin,
  panel,
  scratchCard,
  generateScratch,
  factDept,
  genFactDept,
  deleteFact,
  genDept,
  viewDept,
  genDeptCourse,
  viewDeptCourses,
  studentRecord,
  staffRecord,
  academicSession,
  uploadResult,
  uploadResultPage,
  uploadResultForStudent,
  validateCourse
} = require("../controllers/admin.con");
const auth = require("../auth/auth");
var router = express.Router();
const upload = require("../multer");

router.get("/admin", getAdminPage);
router.post("/signup", upload.single("file"), createAdminSignup);
router.post("/login", loginAdmin);
router.get("/panel", auth.isAdmin, panel);
router.get("/gen-scratch-card", auth.isAdmin, scratchCard);
router.post("/gen-scratch", generateScratch);

// faculty,department and courses routes
router.get("/fact-dept", auth.isAdmin, factDept);
router.post("/create-academicSession", academicSession);
router.post("/gen-fact-dept", genFactDept);
router.post("/gen-dept", genDept);
router.get("/delete-fact/:id", deleteFact);
router.get("/view-depts/:id", auth.isAdmin, viewDept);
router.post("/gen-dept-course/:id",  genDeptCourse);
router.get("/view-depts-courses/:depts/:facts", auth.isAdmin, viewDeptCourses);

// student record routes
router.get("/student-records", auth.isAdmin, studentRecord);
router.get("/staff-records", auth.isAdmin, staffRecord);

// upload-result
router.post("/upload-result", uploadResult);
router.get("/upload-result", auth.isAdmin, uploadResultPage);
// upload result for a particular student
router.get("/upload-result/:id", auth.isAdmin, uploadResultForStudent);
// validate-course
router.post("/validate-course", validateCourse);
module.exports = router;
