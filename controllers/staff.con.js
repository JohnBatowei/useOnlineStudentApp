const staffModel = require("../model/staff.model");
const bcrypt = require("bcrypt");
const faculty = require("../model/faculty");


module.exports.getStaffPage = async function(req,res){
    try {
        // console.log('get the index')
  const data = await faculty.find()
  // console.log(data)
 
     res.render('staffReg',{title:'Staff Portal',data})
    } catch (error) {
     console.log(error.message)
    }
 };

 module.exports.createStaffSignup = async function(req,res){
    try {
        const data = req.body;
        console.log(data);
        const staff = await staffModel.findOne({email: data.email});
        
        if(data.password !== data.conpassword){
            return res.json({data:'password miss match'})
          }

        if (!staff) {
            // const salt = await bcrypt.genSalt(10);
            // const bcryptedPassword = await bcrypt.hash(password,salt)
            let form = new staffModel({
                name:data.name,
                email:data.email,
                staffId:data.staffId,
                gender:data.gender,
                dept:data.dept,
                passport: req.file.filename,
                fact:data.fact,
                password:data.password,
            
            });
            const saveForm = await form.save();
            if (saveForm) {
                res.status(200).json({data:`${saveForm.name} can now login as a staff`})
            }
          } else {
            res.status(400).json({ data: `${data.email} already exist ` });
          }

    } catch (error) {
     console.log(error.message)
    }
 };


 module.exports.loginStaff = async function(req, res) {
    try {
      const { staffId, password } = req.body;
      const staff = await staffModel.findOne({ staffId });
      if (!staff) {
        return res.status(400).json({ data: `${staffId} is not registered` });
      }
      // const passwordMatch = await bcrypt.compare(password, staff.password);
      if (password !== staff.password) {
        return res
          .status(400)
          .json({ data: `password is incorrect` });
      }
      // req.session.isStaff = true;
      // req.session.staffId = staff._id;
      const token = jwt.sign({admin: staff._id},process.env.SECRET)
      res.cookie('token',token,{httpOnly:true})
      res.status(200).json({ data: `/api/staff/panel` });
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports.panel = async function(req, res) {
    try {
      const staffId = req.isStaff ;
      const staff = await staffModel.findOne({ _id: staffId });
      if (staff) {
        res.render("staff/staffPanel", {
          layout: "./layouts/staffLayout",
          name: staff.name,
          passport: staff.passport,
          id:staff._id
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };