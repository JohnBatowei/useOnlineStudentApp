const adminModel = require("../model/admin.model");
// const studentModel = require("../model/student.model");
const factModel = require("../model/faculty");
const scratchCard = require("../model/scratchCard");
const bcrypt = require("bcrypt");
const CoursesModel = require("../model/courses.model");
const academicSessionModel = require("../model/aSession");
const studentCoursesRegModel = require("../model/student.courses.reg.model");
const resultModel = require('../model/result.model')
const jwt = require('jsonwebtoken')

module.exports.getAdminPage = async function(req, res) {
  try {
    res.render("adminReg", { title: "Admin Portal" });
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.createAdminSignup = async function(req, res) {
  try {
    const { name, email, password } = req.body;
    // console.log(req.body)
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const bcryptedPassword = await bcrypt.hash(password,salt)
      let form = new adminModel({
        passport: req.file.filename,
        name,
        email,
        password: bcryptedPassword
      });
      const saveForm = await form.save();
      if (saveForm) {
        // req.session.isAdmin = true;
        // req.session.adminId = saveForm._id;
        const token = jwt.sign({admin: saveForm.id},process.env.SECRET)
        res.cookie('token',token,{httpOnly:true})
        // const token = jwt.sign({ admin: admin._id }, process.env.SECRET, { expiresIn: '7d' });
        // res.cookie(`jwtToken_${email}`, token, { httpOnly: true, secure: true });

        res.status(200).json({
          data: `/api/admin/panel`,
          data2: `${saveForm.name} has been created `
        });
        // res.status(200).json({data:`${saveForm.name} has been created `})
      }
    } else {
      res.status(400).json({ data: `${email} already exist ` });
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.loginAdmin = async function(req, res) {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    //  const thisEmail = email
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ data: `${email} is not registered` });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ data: `${password} as password is not correct` });
    }
    const token = jwt.sign({admin: admin._id},process.env.SECRET)
    // req.session.isAdmin = true;
    // req.session.adminId = admin._id;
    res.cookie('token',token,{httpOnly:true})
    // const token = jwt.sign({ admin: admin._id }, process.env.SECRET, { expiresIn: '7d' });
    // res.cookie(`jwtToken_${email}`, token, { httpOnly: true, secure: true });
    res.status(200).json({ data: `/api/admin/panel` });
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.panel = async function(req, res) {
  try {
    const adminId = req.isAdmin;
    const admin = await adminModel.findOne({ _id: adminId });
    if (admin) {
      res.render("admin/adminPanel", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        id: admin._id
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports.scratchCard = async function(req, res, next) {
  try {
    const adminId = req.isAdmin;
    const card = await scratchCard.find().sort({ createdAt: -1 });

    const admin = await adminModel.findById(adminId);
    if (admin) {
      console.log(admin);
      return res.status(200).render("admin/genScratchCard", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        card
      });
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};


module.exports.generateScratch = async function(req, res, next) {
  try {
    console.log(req.body.generate);
    function generateScratch(length) {
      const uniq = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * uniq.length);
        result += uniq[randomIndex];
      }
      return result;
    }
    const card = generateScratch(8);
    // const scratch = await scratchCard.findOne({card: card})
    const myCard = new scratchCard({
      card
    });
    const save = await myCard.save();
    if (!save) {
      throw Error("unable to save");
    }
    res.status(200).json({ data: "generated" });
  } catch (error) {
    console.log(error.message);
    next();
  }
};


module.exports.factDept = async function(req, res, next) {
  try {
    const adminId = req.isAdmin;
    const admin = await adminModel.findById(adminId);

    const fact = await factModel.find().sort({ createdAt: -1 });
    const academicSession = await academicSessionModel.find().sort({ createdAt: -1 });
    if (admin) {
      //  console.log(admin)
      return res.status(200).render("admin/factDept", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        fact,academicSession
      });
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};


module.exports.genFactDept = async function(req, res, next) {
  try {
    //  console.log(req.body.fact)
    // console.log(req.body.id)
    if (!req.body.fact) {
      return res.status(400).json({ data: "Faculty field cannot be empty" });
    }
    const facts = await factModel.findOne({
      fact: req.body.fact.toLowerCase()
    });
    if (!facts) {
      const form = new factModel({
        fact: req.body.fact
      });
      const save = await form.save();
      if (save) {
        res.status(200).json({ data: `${save.fact} has been created` });
      }
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};


module.exports.academicSession = async function(req, res) {
  try {
    //  console.log(req.body.fact)
    console.log(req.body.academicSession)
    if (!req.body.academicSession) {
      return res.status(400).json({ data: "academicSession field cannot be empty" });
    }
    const Asession = await academicSessionModel.findOne({academicSession: req.body.academicSession});
    if (!Asession) {
      const form = new academicSessionModel({
        academicSession: req.body.academicSession
      });
      const save = await form.save();
      if (save) {
        // return res.status(300).redirect("/api/admin/fact-dept");
       return res.status(200).json({data:`${save.academicSession} session created`})
      }
    }
   return res.status(200).json({data:`${req.body.academicSession} already exist`})

  } catch (error) {
    console.log(error.message);
  }
};


module.exports.genDept = async function(req, res, next) {
  try {
    const facts = await factModel.findOneAndUpdate(
      { fact: req.body.fact },
      { $push: { dept: req.body.dept } },
      { new: true }
    );

    if (facts) {
      return res.status(300).redirect("/api/admin/fact-dept");
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};


module.exports.deleteFact = async function(req, res, next) {
  try {
    const data = await factModel.findOneAndDelete({ _id: req.params.id });
    if (data) {
      //  return res.status(200).json({data:`${data.fact} has been deleted`})
      return res.status(300).redirect("/api/admin/fact-dept");
    }
    return res.status(400).json({ data: `cannot delete ${data.fact}` });
  } catch (error) {
    console.log(error.message);
    //  next()
  }
};


module.exports.viewDept = async function(req, res, next) {
  try {
    const adminId = req.isAdmin;
    const admin = await adminModel.findById(adminId);
    const data = await factModel.findOne({ _id: req.params.id });

    if (data && admin) {
      return res.status(200).render("admin/viewAllDepts", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        card: data
      });
    }
  } catch (error) {
    console.log(error.message);
    //  next()
  }
};


module.exports.viewDeptCourses = async function(req, res, next) {
  try {
    const adminId = req.isAdmin;
    const admin = await adminModel.findById(adminId);
    const {depts,facts} = req.params
    // console.log('got it '+facts+' '+depts)
    const data = await CoursesModel.find({ dept:depts});
 
    console.log(data+' got it right')

    if (data && admin) {
      return res.status(200).render("admin/viewDeptCourses", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        card: data,depts,facts
      });
    }
  } catch (error) {
    console.log(error.message);
    //  next()
  }
};


// handle upload courses
module.exports.genDeptCourse = async function(req, res, next) {
  try {
    const data = req.body;
    console.log(req.params.id)
    // console.log(data)
    if (
      !data.dept ||
      !data.semester ||
      !data.type ||
      !data.unit ||
      !data.level
    ) {
      return res.json({ message: "all fields are required" });
    }
    const {
      level,
      courseCode,
      courseTitle,
      semester,
      type,
      unit,
    } = data
      const form = new CoursesModel({
        fact: data.fact,
        dept: data.dept,
        level,courseCode,courseTitle,semester,type,unit
      });
      const save = await form.save();
      if (save) {
        return res.status(300).redirect(`/api/admin/view-depts/${req.params.id}`);
      }
  
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// student records
module.exports.studentRecord = async function(req,res){
  try {
    const adminId = req.isAdmin;
    const admin = await adminModel.findById(adminId);

 
  
    if (admin) {
      return res.status(200).render("admin/studentRecords", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        title:'Student'
      });
    }
  } catch (error) {
    console.log(error.message);
    //  next()
  }
}


module.exports.staffRecord = async function(req,res){
  try {
    const adminId = req.isAdmin;
    const admin = await adminModel.findById(adminId);

    if (admin) {
      return res.status(200).render("admin/staffRecords", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        // title:'Staff'
      });
    }
  } catch (error) {
    console.log(error.message);
    //  next()
  }
}


 // Adjust the path according to your project structure

 module.exports.uploadResult = async function(req, res) {
  try {
      const {
          studentRegId,
          session,
          matNo,
          semester,
          level,
          staffId,
          courseTitle,
          coursCode,
          score,
          grade,
          courseId,std
      } = req.body;

      console.log(req.body);

      if( !score || !grade){
        return res.json({ data: 'Score or Grade cannot be empty' });
      }
      // Find if the student record exists for the given session, matNo, semester, and level
      let student = await resultModel.findOne({ studentId: std, session, matNo, semester, level });
      const registeredStudent = await studentCoursesRegModel.findOne({_id: studentRegId});

      if (!student) {
          // If student record does not exist, create a new one
          student = new resultModel({
              studentId: std,
              session,
              matNo,
              semester,
              level,
              courses: [{
                  staffId,
                  courseTitle,
                  coursCode,
                  score,
                  grade
              }]
          });
      } else {
          // If student record exists, add the course to the existing courses array
          student.courses.push({
              staffId,
              courseTitle,
              coursCode,
              score,
              grade
          });
      }

      // Update the withResult property
      registeredStudent.courses.forEach(course => {
          if (courseId === course._id.toString()) {
              course.withResult = 'yes';
          }
      });

      await registeredStudent.save();
      await student.save();
      return res.json({ data: 'Uploaded successfully' });

  } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports.uploadResultPage = async function(req,res){
  try {
    const adminId = req.isAdmin;
    const admin = await adminModel.findOne({ _id: adminId });

    const registeredStudent = await studentCoursesRegModel.find({status : 'true'})

 

    // console.log(registeredStudent)
    if (admin) {
      res.render("admin/uploadResultPage", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        id: admin._id,
        data:registeredStudent
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports.uploadResultForStudent = async function(req,res){
  try {
    const studentId = req.params.id
    const adminId = req.isAdmin;
    const admin = await adminModel.findOne({ _id: adminId });

    const registeredStudent = await studentCoursesRegModel.findOne({_id:studentId})
    const coursesWithNoResult = registeredStudent.courses.filter(i => {return (i.withResult === 'no')})

    // console.log(registeredStudent)
    if (admin) {
      res.render("admin/uploadResult", {
        layout: "./layouts/adminLayout",
        name: admin.name,
        passport: admin.passport,
        id: admin._id,
        data:registeredStudent,
        data1:coursesWithNoResult
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}


module.exports.validateCourse = async function(req,res){
  try {
   const {studentId, courseId} = req.body

    const registeredStudent = await studentCoursesRegModel.findOne({_id:studentId})
    // const result = await resultModels.findOne({_id:studentId})
    
    if(registeredStudent){
    const courseIndex = registeredStudent.courses.find(course => {
      return (
        String(course._id) === String(courseId) 
        );
      });
   return res.status(200).json({data:courseIndex,std:registeredStudent.studentId})
    // console.log(courseIndex)
  }
  
 return res.status(400).json({data:'Failed to process data'})
  
  } catch (error) {
    console.log(error.message);
  }
}