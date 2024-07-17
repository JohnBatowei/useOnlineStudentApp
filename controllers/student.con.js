const faculty = require("../model/faculty");
const scratchCard = require("../model/scratchCard");
const studentModel = require("../model/student.model");
const academicSessionModel = require("../model/aSession");
const CoursesModel = require("../model/courses.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");
const studentCoursesRegModel = require("../model/student.courses.reg.model");
const jwt = require("jsonwebtoken");
const resultModel = require("../model/result.model");

module.exports.createStudentSignup = async function (req, res) {
  try {
    const data = req.body;
    // console.log(data);
    const admin = await studentModel.findOne({ email: data.email });
    const card = await scratchCard.findOne({ card: data.scratchCard });

    if (data.password !== data.conpassword) {
      return res.json({ data: "passwords miss match" });
    }

    if (!card) {
      return res.json({ data: "invalid scratch card" });
    }
    if (!admin) {
      // const salt = await bcrypt.genSalt(10);
      // const bcryptedPassword = await bcrypt.hash(password,salt)
      let form = new studentModel({
        name: data.name,
        email: data.email,
        matNo: data.matNo,
        gender: data.gender,
        dept: data.dept,
        scratchCard: data.scratchCard,
        phone: data.phone,
        passport: req.file.filename,
        fact: data.fact,
        password: data.password
      });
      const saveForm = await form.save();
      if (saveForm) {
        const findCardAndDelete = await scratchCard.findOneAndDelete({
          card: saveForm.scratchCard
        });

        res.status(200).json({ data: `${saveForm.name} can now login ` });
      }
    } else {
      res.status(400).json({ data: `${data.email} already exist ` });
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.loginStudent = async function (req, res) {
  try {
    const { matNo, password } = req.body;
    console.log(req.body);
    //  const thisEmail = email
    const admin = await studentModel.findOne({ matNo });
    if (!admin) {
      return res.status(400).json({ data: `${matNo} is not registered` });
    }
    // const passwordMatch = await bcrypt.compare(password, admin.password);
    if (password !== admin.password) {
      return res.status(400).json({ data: `password is not correct` });
    }
    // req.session.isStudent = true;
    // req.isStudent = admin._id;
    const token = jwt.sign({ admin: admin._id }, process.env.SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ data: `/api/student/panel` });
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.panel = async function (req, res) {
  try {
    const adminId = req.isStudent;
    const admin = await studentModel.findOne({ _id: adminId });
    if (admin) {
      res.render("student/studentPanel", {
        layout: "./layouts/studentLayout",
        name: admin.name,
        passport: admin.passport,
        id: admin._id
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.checkResult = async function (req, res) {
  try {
    const adminId = req.isStudent;
    const admin = await studentModel.findOne({ _id: adminId });

    if (!admin) {
      return res.status(404).send({ data: "Student not found" });
    }

    const findResult = await resultModel.find({ studentId: adminId });

    // Group results by session
    const groupedResults = findResult.reduce((acc, result) => {
      if (!acc[result.session]) {
        acc[result.session] = [];
      }
      acc[result.session].push(result);
      return acc;
    }, {});

    // console.log("Grouped Results by Session: ", groupedResults);

    res.render("student/checkResult", {
      layout: "./layouts/studentLayout",
      name: admin.name,
      passport: admin.passport,
      id: admin._id,
      admin,
      resultsBySession: groupedResults // Pass the grouped results to the view
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ data: "An error occurred" });
  }
};


module.exports.studentDept = async function (req, res) {
  try {
    const { facts, id } = req.body;
    // const fact = await faculty.findOne({fact:facts})
    const fact = await faculty.findById(id);
    console.log(fact);
    console.log(id);
    console.log(facts);
    if (fact) {
      const dept = [];
      for (let i of fact.dept) {
        dept.push(i);
      }

      res.status(200).json({ data: dept });
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.courseRegistration = async function (req, res) {
  try {
    const adminId = req.isStudent;
    const admin = await studentModel.findOne({ _id: adminId });
    const academicSession = await academicSessionModel.find();
    const courses = await CoursesModel.find();
    const convertedAdminId = new mongoose.Types.ObjectId(adminId);

    const findRegistrationForm = await studentCoursesRegModel.findOne({
      status: false,
      studentId: adminId
    });
    const RegisteredCourse = await studentCoursesRegModel.find({
      status: true,
      studentId: adminId
    });

    // console.log('hello course')
    let course = [];
    if (
      findRegistrationForm &&
      findRegistrationForm.courses &&
      findRegistrationForm.courses.length > 0
    ) {
      for (let i of findRegistrationForm.courses) {
        course.push(i);
      }
    }

    let Rcourse = [];
    if (
      RegisteredCourse &&
      RegisteredCourse.courses &&
      RegisteredCourse.courses.length > 0
    ) {
      for (let i of RegisteredCourse.courses) {
        Rcourse.push(i);
      }
    }

    console.log(RegisteredCourse);

    if (admin) {
      res.render("student/courseRegistration", {
        layout: "./layouts/studentLayout",
        name: admin.name,
        passport: admin.passport,
        id: admin._id,
        matNo: admin.matNo,
        academicSession,
        courses,
        findRegistrationForm,
        course,
        RegisteredCourse,
        Rcourse
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.createRegistration = async (req, res) => {
  try {
    // console.log(req.body)
    const { session, semester, level, studentId, studentName, matNo } =
      req.body;
    const findRegistrationForm = await studentCoursesRegModel.findOne({
      status: false,
      studentId
    });

    if (!findRegistrationForm) {
      const newStudentRegForm = new studentCoursesRegModel({
        studentId: studentId,
        session: session,
        level: level,
        semester: semester,
        matNo: matNo,
        status: false,
        studentName: studentName,
        totalUnit: 0
      });

      const saveForm = await newStudentRegForm.save();

      if (saveForm) {
        return res
          .status(200)
          .json({ data: `Registration form created successfully` });
      }
    }
    return res
      .status(400)
      .json({
        data: `Sorry already exsisting registration form else delete and recreate`
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ data: `Internal Server Error` });
  }
};


module.exports.studentCourseRegistration = async (req, res) => {
  try {
    const { course, studentId, studentName } = req.body;

    // Validate input
    if (!course || !studentName || !studentId) {
      return res
        .status(400)
        .json({ data: "Course, student ID, and student name are required" });
    }

    // Ensure studentId is a valid ObjectId
    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({ data: "Invalid student ID" });
    }

    const admin = await studentModel.findById(studentId);
    if (!admin) {
      return res.status(404).json({ data: "Student not found" });
    }

    // Ensure course is a valid ObjectId
    if (!ObjectId.isValid(course)) {
      return res.status(400).json({ data: "Invalid course ID" });
    }

    const findCourse = await CoursesModel.findById(course);
    if (!findCourse) {
      return res.status(400).json({ data: "Could not find the course" });
    }

    const findRegistrationForm = await studentCoursesRegModel.findOne({
      status: "false",
      studentId: studentId
    });
    if (!findRegistrationForm) {
      return res.status(400).json({ data: "The form could not be found" });
    }

    // Update total unit and add course to the form
    let unitCourses =
      parseInt(findCourse.unit) + parseInt(findRegistrationForm.totalUnit);

    findRegistrationForm.totalUnit = unitCourses;
    // findRegistrationForm.totalUnit += findCourse.unit;
    findRegistrationForm.courses.push({
      title: findCourse.courseTitle,
      courseCode: findCourse.courseCode,
      courseUnit: findCourse.unit,
      type: findCourse.type
    });

    await findRegistrationForm.save();

    return res
      .status(200)
      .json({ data: "Course added to created registration successfully" });
  } catch (error) {
    console.error(error);

    // Improved error message handling
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ data: "Invalid course data" });
    } else if (error.kind === "ObjectId") {
      return res.status(400).json({ data: "Invalid ID format" });
    } else {
      return res.status(500).json({ data: "Internal Server Error" });
    }
  }
};


module.exports.deleteCourse = async (req, res) => {
  try {
    let { oneCourse, registrationId } = req.body;
    const adminId = req.isStudent;
    // Ensure studentId is a valid ObjectId
    if (!ObjectId.isValid(adminId)) {
      return res.status(400).json({ data: "Invalid student ID" });
    }
    console.log(adminId);

    // Find the course
    const findRegistrationForm = await studentCoursesRegModel.findOne({
      _id: registrationId,
      status: "false",
      studentId: adminId
    });

    // console.log(findRegistrationForm);
    if (!findRegistrationForm) {
      return res.status(404).json({ data: "Registration form not found" });
    }

    // Find the course index in the courses array
    const courseIndex = findRegistrationForm.courses.findIndex((course) => {
      return String(course._id) === String(oneCourse);
    });

    const courseUnitToBeDeleted = findRegistrationForm.courses.filter(
      (course) => {
        return String(course._id) === String(oneCourse);
      }
    );

    // console.log(courseIndex);
    if (courseIndex === -1) {
      return res
        .status(404)
        .json({ data: "Course not found in the registration form" });
    }

    // console.log(courseUnitToBeDeleted[0].courseUnit)
    // Remove the course from the courses array
    findRegistrationForm.courses.splice(courseIndex, 1);
    let unitCourses =
      parseInt(findRegistrationForm.totalUnit) -
      parseInt(courseUnitToBeDeleted[0].courseUnit);

    findRegistrationForm.totalUnit = unitCourses;
    // Save the updated registration form
    await findRegistrationForm.save();

    res.status(200).json({ data: "Course removed successfully" });
  } catch (error) {
    console.error("An error occurred while removing the product:", error);
    res.status(500).json({ error: "Failed to remove course" });
  }
};


module.exports.deleteRegistrationForm = async (req, res) => {
  try {
    let { regId } = req.body;

    // Find the registratonForm by its regId
    const registratonForm = await studentCoursesRegModel.findOneAndDelete({
      _id: regId
    });
    res.status(200).json({ data: "Registration form removed successfully" });
  } catch (error) {
    console.error(
      "An error occurred while removing the registration form:",
      error
    );
    res.status(500).json({ error: "Failed to remove registration form" });
  }
};


module.exports.saveRegistrationForm = async (req, res) => {
  try {
    let { regId } = req.body;

    const registratonForm = await studentCoursesRegModel
      .findOne({ _id: regId })
      .populate("courses");

    if (!registratonForm) {
      return res.status(404).json({ error: "Registraton form not found" });
    }

    registratonForm.status = true;

    const registrationFormSave = await registratonForm.save();
    if (!registrationFormSave) {
      return res.status(500).json({ data: "Failed to save registraton form" });
    }

    res
      .status(200)
      .json({
        data: `You have successfully registered for ${registratonForm.session} session and ${registratonForm.semester} semester in your ${registratonForm.level} level`
      });
  } catch (error) {
    console.error("An error occurred while saving the cart:", error);
    res.status(500).json({ error: "Failed to save cart" });
  }
};

module.exports.viewRegistrateredCourses = async function (req, res) {
  try {
    const adminId = req.isStudent;
    const admin = await studentModel.findOne({ _id: adminId });
    const registrateredCourses = await studentCoursesRegModel
      .findOne({ _id: req.params.id })
      .populate("courses");

    if (!registrateredCourses) {
      return res.status(400).send({ data: "cannot find" });
    }

    //  console.log(registrateredCourses)

    if (admin) {
      res.render("student/viewRegisteredCourses", {
        layout: "./layouts/studentLayout",
        name: admin.name,
        passport: admin.passport,
        id: admin._id,
        registrateredCourses
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.checkResultStudent = async function (req, res) {
  try {
    const adminId = req.isStudent;
    const admin = await studentModel.findOne({ _id: adminId });
    const registrateredCourses = await studentCoursesRegModel
      .findOne({ _id: req.params.id })
      .populate("courses");

    if (!registrateredCourses) {
      return res.status(400).send({ data: "cannot find" });
    }

    const findResult = await resultModel.findOne({
      studentId: adminId,
      session: registrateredCourses.session,
      semester: registrateredCourses.semester
    });
    // console.log("Admin: ", admin);
    // console.log("Registered Courses: ", registrateredCourses);
    // console.log("Find Result: ", findResult);

    if (!findResult) {
      return res.status(404).send({ data: "Result not found" });
    }

    //  console.log(registrateredCourses)

    if (admin) {
      res.render("student/checkResultStudent", {
        layout: "./layouts/studentLayout",
        name: admin.name,
        passport: admin.passport,
        id: admin._id,
        registrateredCourses,
        findResult
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// module.exports.checkResultStudentPerSession = async function (req, res) {
//   try {
//     const adminId = req.isStudent;
//     const admin = await studentModel.findOne({ _id: adminId });
//     const registrateredCourses = await studentCoursesRegModel
//       .findOne({ _id: req.params.id })
//       .populate("courses");

//     if (!registrateredCourses) {
//       return res.status(400).send({ data: "cannot find" });
//     }

//     const findResult = await resultModel.find({
//       studentId: adminId,
//       session: registrateredCourses.session
//     });
//     console.log("Admin: ", admin);
//     console.log("Registered Courses: ", registrateredCourses);
//     console.log("Find Result: ", findResult);

//     if (!findResult) {
//       return res.status(404).send({ data: "Result not found" });
//     }

//     //  console.log(registrateredCourses)

//     if (admin) {
//       res.render("student/checkResultStudent", {
//         layout: "./layouts/studentLayout",
//         name: admin.name,
//         passport: admin.passport,
//         id: admin._id,
//         registrateredCourses,
//         findResult
//       });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };
