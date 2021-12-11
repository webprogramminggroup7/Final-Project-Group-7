const User = require("./../models/userSchemaModel")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const sendEmailForPasswordReset = require("./emailforResetPassword")
const multer = require("multer");

const multerStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename : (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
})

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Not an image', false);
  }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo');


const cookie = {
    expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
}
const signup = async (req,res)=>{
  console.log(req.file);
try{
RequestBodyObject = {
    email : req.body.email,
    name  : req.body.name,
    password : req.body.password,
    passwordConfirm : req.body.passwordConfirm,
    // passwordChangedAt:req.body.passwordChangedAt
    role:req.body.role
}
if(req.file) RequestBodyObject.photo = req.file.filename;

const newUserSignUp = await User.create(RequestBodyObject)
const JWT_TOKEN = jwt.sign({id:newUserSignUp._id,name:newUserSignUp.name},process.env.SECRET_JSON_WEB_TOKEN,{
    expiresIn:process.env.EXPIRES_IN_JWT
})
res.cookie('jwt', JWT_TOKEN, {
    expires: new Date(
        Date.now() + 45 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:true
});
newUserSignUp.password = undefined;

res.status(201).json({
    status:"Successfully signed up New User",
    JWT_TOKEN,
    data:{
        user:newUserSignUp
    }
})
}catch(error){
    res.status(404).json({
        status:"Failed to signup new user",
        message:error
        })
}
}



const login = async (req,res) =>{
    
    try{
        const email = req.body.email;
        const password = req.body.password;
        if(!email || !password){
            return res.status(400).json({message:"Please Provide Password or Email"})
        }
        const UserFromDatabase = await User.findOne({email:email}).select("+password")
        // console.log(UserFromDatabase)
        match = await UserFromDatabase.comparePassword(password,UserFromDatabase.password)
        if(!UserFromDatabase || !match){
          return res.status(401).json({message:"Invalid Email Or Password. Please Enter the Correct Credentials !"})  
        }
        const JWT_TOKEN = jwt.sign({id:UserFromDatabase._id,name:UserFromDatabase.name},process.env.SECRET_JSON_WEB_TOKEN,{
            expiresIn:process.env.EXPIRES_IN_JWT
        })
        res.cookie('jwt', JWT_TOKEN, {
            expires: new Date(
                Date.now() + 45 * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
              secure:true
        });
        UserFromDatabase.password = undefined;  
        res.status(200).json({
            status:"Succesfully Logged In",
            token : JWT_TOKEN,

        })

    }catch(error){
        res.status(404).json({
            status:"Failed to login user",
            message:error
            })
    }
    }
    
const protectedRoute = async (req,res,next)=>{
    try{
     let jwt_token;
     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
         jwt_token = req.headers.authorization.split(' ')[1]

     }else if(req.cookies.jwt){
        jwt_token = req.cookies.jwt
     }
    //  console.log(jwt_token)
     if(!jwt_token){
         return res.status(401).json({message:"You are Not Logged In to Access this.Please Login to get access"})
     }
     let decoded;
     try{
       decoded = await promisify(jwt.verify)(jwt_token,process.env.SECRET_JSON_WEB_TOKEN)
    //   console.log(decoded)
     }catch(e){
         return res.status(401).json({message:"Your Token Has expired Please Login Again"})
     }

     const NewUser = await User.findById(decoded.id)
    //  console.log(NewUser)
     if(!NewUser){
         return res.status(401).json({message:"The User Belonging to this user does not no longer exist"})
     }
    //  console.log(NewUser.changedPasswordAfter(decoded.iat))
     if(NewUser.changedPasswordAfter(decoded.iat)){
         return res.status(401).json({message:"User recently changed password..please login again...!"})
     }

     req.user = NewUser;
     res.locals.user = NewUser;
     next()
    }catch(error){
     res.status(401).json({message:error})
    }
    
}
const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.SECRET_JSON_WEB_TOKEN
        );

        const NewUser = await User.findById(decoded.id);
        if (!NewUser) {
          return next();
        }
        if (NewUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }
        res.locals.user = NewUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };
const OnlyGiveAccessTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:"You Dont Have Previlage to Perform this operation"})
        }
        next()
}
}

const forgotPassword = async (req,res)=>{
    try{
    const UserFromDatabase = await User.findOne({email:req.body.email})
    if(!UserFromDatabase){
        return res.status(404).json({message:"No user found with the given email address"})
    }
    const generatedToken  = UserFromDatabase.generatePasswordResetToken()
    await UserFromDatabase.save({validateBeforeSave:false})
    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/travel-bliss/users/resetPassword/${generatedToken}`;
    
      const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    
      try {
        await sendEmailForPasswordReset({
          email: UserFromDatabase.email,
          subject: 'Your password reset token (valid for 10 min)',
          message
        });
    
        res.status(200).json({
          status: 'success',
          message: 'Token sent to email!'
        });
      } catch (err) {
        UserFromDatabase.passwordResetToken = undefined;
        UserFromDatabase.passwordResetExpires = undefined;
        await UserFromDatabase.save({ validateBeforeSave: false });
    
        return res.status(500).json({message:"There was an error sending the email. Try again later!'"})
        
      }
    
    }catch(e){
        res.status(404).json({message:e})
    }
}
const resetPassword = async (req,res)=>{
    try{

    
    const generateHashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const UserFromDatabase = await User.findOne({
    passwordResetToken: generateHashToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!UserFromDatabase) {
    return res.status(400).json({message:"Token has expired or invalid"})     
  }
  UserFromDatabase.password = req.body.password;
  UserFromDatabase.passwordConfirm = req.body.passwordConfirm;
  UserFromDatabase.passwordResetToken = undefined;
  UserFromDatabase.passwordResetExpires = undefined;
  await UserFromDatabase.save();

  const JWT_TOKEN = jwt.sign({id:UserFromDatabase._id,name:UserFromDatabase.name},process.env.SECRET_JSON_WEB_TOKEN,{
    expiresIn:process.env.EXPIRES_IN_JWT
})
res.cookie('jwt',JWT_TOKEN, {
    expires: new Date(
        Date.now() + 45 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:false
});
 UserFromDatabase.password = undefined; 
res.status(200).json({
    status:"Succesfully Logged In",
    token : JWT_TOKEN,

})
    }catch(err){
        res.status(400).json({message:err})
    }

}
const updatePassword = async (req,res)=>{
try{
 const UserFromDatabase = await User.findById(req.user.id).select('+password');
 if (!(await UserFromDatabase.comparePassword(req.body.passwordCurrent, UserFromDatabase.password))) {
    return res.status(401).json({message:"Your current password is wrong"})
  }
  UserFromDatabase.password = req.body.password;
  UserFromDatabase.passwordConfirm = req.body.passwordConfirm;
  await UserFromDatabase.save();

  const JWT_TOKEN = jwt.sign({id:UserFromDatabase._id,name:UserFromDatabase.name},process.env.SECRET_JSON_WEB_TOKEN,{
    expiresIn:process.env.EXPIRES_IN_JWT
})
res.cookie('jwt',JWT_TOKEN, {
    expires: new Date(
        Date.now() + 45 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:false
});
 UserFromDatabase.password = undefined; 
res.status(200).json({
    status:"Succesfully Logged In",
    token : JWT_TOKEN,

})
}catch(e){
    res.status(400).json({message:e})
}
}

const logout = (req, res) => {
    res.cookie('jwt', 'LoggedOutSuccesfully', {
      expires: new Date(Date.now() + 15 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'successfully logged out' });
  };


module.exports = {
    signup,
    login,
    protectedRoute,
    isLoggedIn,
    OnlyGiveAccessTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout
}