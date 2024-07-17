const adminModel = require("../model/admin.model");
const staffModel = require("../model/staff.model");
const studentModel = require("../model/student.model");
const jwt = require('jsonwebtoken')


const isAdmin = async (req,res,next)=>{
    const authorization  = req.cookies.token
    // console.log(authorization)

    if(!authorization){
        return res.status(401).json({message: 'You are not authorize'})
    }

    try {
        const decoded = jwt.verify(authorization, process.env.SECRET)
        
        const admin = await adminModel.findOne({_id:decoded.admin}).select('_id')
        if(!admin){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.isAdmin = admin
        // console.log(req.isAdmin)
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

// Middleware to verify admin status

// const isAdmin = async (req, res, next) => {
//     try {
//       const cookieNames = Object.keys(req.cookies);
//       let email = null;
//         console.log(cookieNames)
//         console.log(req.body)
//         console.log(req.params)
//         console.log(req.cookies)
//         console.log(req.query.id)
//     //   // Find the correct cookie based on your naming convention
//       const jwtCookie = cookieNames.find(name => name.startsWith('jwtToken_'));
  
//       if (!jwtCookie) {
//         return res.status(401).json({ message: 'No JWT token found in cookies' });
//       }
  
//       // Extract email or identifier from the cookie name
//       email = jwtCookie.replace('jwtToken_', '');
  
//       if (!email) {
//         return res.status(401).json({ message: 'Email is required for authorization' });
//       }
  
//       const token = req.cookies[jwtCookie];
  
//       if (!token) {
//         return res.status(401).json({ message: 'Token not found in cookies' });
//       }
  
//       // Verify token validity
//       const decoded = jwt.verify(token, process.env.SECRET);
//       const admin = await adminModel.findOne({ _id: decoded.admin }).select('_id');
  
//       if (!admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
  
//       req.isAdmin = admin;
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
  


const isStudent =async (req,res,next)=>{
    const authorization  = req.cookies.token
    // console.log(authorization)
    
    if(!authorization){
        return res.status(401).json({message: 'You are not authorize'})
    }
 
    try {
        const decoded = jwt.verify(authorization, process.env.SECRET)
        
        const admin = await studentModel.findOne({_id:decoded.admin}).select('_id')
        if(!admin){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        req.isStudent = admin
        // console.log(req.isAdmin)
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}



const isStaff = async (req,res,next)=>{
    const authorization  = req.cookies.token
    // console.log(authorization)

    if(!authorization){
        return res.status(401).json({message: 'You are not authorize'})
    }

 
    try {
        const decoded = jwt.verify(authorization, process.env.SECRET)
        
        const admin = await staffModel.findOne({_id:decoded.admin}).select('_id')
        if(!admin){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.isStaff = admin
        // console.log(req.isAdmin)
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = {
    isAdmin,isStaff,isStudent
}